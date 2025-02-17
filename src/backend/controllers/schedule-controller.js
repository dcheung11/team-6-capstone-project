const mongoose = require("mongoose");
const Schedule = require("../models/schedule");
const Gameslot = require("../models/gameslot");
const Game = require("../models/game");
const Season = require("../models/season");
const Division = require("../models/division");
const HttpError = require("../models/http-error");

const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate(
      "games division season schedule"
    );
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("games seasonId")
      .populate({
        path: "games",
        populate: ["homeTeam", "awayTeam"],
      });

    if (!schedule) return res.status(404).json({ error: "Schedule not found" });
    res.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ error: "Failed to delete schedule" });
  }
};

const generateSchedule = async (req, res) => {
  try {
    console.log("Starting schedule generation...");
    console.log("req.body: ", req.body);
    const { seasonId } = req.body;

    // console.log("seasonId: ", seasonId);

    if (!seasonId) return res.status(400).json({ error: "Season ID required" });

    // create season object from seasonId and populate divisions to have division objects
    const season = await Season.findById(seasonId)
      .populate("divisions")
      .populate("schedule");

    // console.log("season: ", season);

    // Find or create season-level schedule
    let schedule = season.schedule;

    if (schedule) {
      // If a schedule already exists, delete the old games and the schedule - prevents duplicates
      const oldSchedule = await Schedule.findById(season.schedule);
      if (oldSchedule) {
        // Delete all games associated with the old schedule first
        await Promise.all(
          oldSchedule.games.map(async (gameId) => {
            const game = await Game.findByIdAndDelete(gameId);
            if (game) {
              // Update the corresponding game slots to set the `game` field to `null`
              await Gameslot.updateMany(
                { game: gameId },
                { $set: { game: null } }
              );
            }
          })
        );

        // Delete the old schedule itself
        oldSchedule.games = [];
        await oldSchedule.save(); // Save the schedule with an empty games array
        schedule = await Schedule.findById(season.schedule);
      }
    } else {
      // No existing schedule, so create a new one
      schedule = new Schedule({ seasonId: seasonId });
      await schedule.save();

      season.schedule = schedule._id;
      await season.save();
      // console.log("New season schedule created: ", season);
    }

    // Generate global gameslots once
    if (schedule.gameSlots.length === 0) {
      await generateGameSlots(schedule, season.startDate, season.endDate);
    }

    // Process each division
    // for (const divisionId of season.divisions) {
    //   const division = await Division.findById(divisionId).populate("teams");
    //   if (!division || division.teams.length < 2) continue;

    //   const teams = division.teams;
    //   const pairings = generateDivisionPairings(teams);
    //   await assignDivisionGames(pairings, schedule, division);
    // }

    // Collect all pairings across divisions
    const allPairings = [];
    const allTeams = new Map(); // teamID -> team object

    // TODO: Account for byes
    // TODO: Make sure all teams in a division play each other evenly

    for (const divisionId of season.divisions) {
      const division = await Division.findById(divisionId).populate("teams");
      // if (!division?.teams?.length) continue;
      if (!division || division.teams.length < 2) continue;

      // Store teams in global map
      division.teams.forEach((team) => {
        allTeams.set(team._id.toString(), team);
      });

      // Generate pairings for this division
      const pairings = generateDivisionPairings(division.teams);
      allPairings.push(
        ...pairings.map((p) => ({
          home: p[0],
          away: p[1],
          division,
        }))
      );
    }

    // Shuffle pairings globally
    const shuffledPairings = shuffleArray(allPairings);
    console.log(`Processing ${shuffledPairings.length} pairings`);

    // Initialize tracking
    const teamTotalGames = new Map();
    const teamAvailability = new Map();
    const teamWeeklyCounts = new Map();

    // Initialize all teams' counts
    allTeams.forEach((team, id) => {
      teamTotalGames.set(id, 0);
      teamAvailability.set(id, new Set());
      teamWeeklyCounts.set(id, new Map());
    });

    // Get available slots ONCE and track used slots
    const allSlots = await Gameslot.find({ schedule: schedule._id }).lean();
    const availableSlots = allSlots.filter((s) => !s.game);
    console.log("availableSlots[0]: ", availableSlots[0]);
    console.log(`Found ${availableSlots.length} available slots`);

    // Process pairings
    for (const { home, away, division } of shuffledPairings) {
      const homeId = home._id.toString();
      const awayId = away._id.toString();

      // Skip if teams have enough games already
      if (
        teamTotalGames.get(homeId) >= 20 ||
        teamTotalGames.get(awayId) >= 20
      ) {
        continue;
      }

      // Find first available slot that meets constraints
      for (const slot of availableSlots) {
        if (slot.game) continue; // Skip already assigned

        const slotDate = new Date(slot.date);
        const weekNumber = getWeekNumber(slotDate, season.startDate);
        const slotDateStr = slotDate.toISOString().split("T")[0];

        // Check weekly limits (3 games)
        const homeWeekly = teamWeeklyCounts.get(homeId).get(weekNumber) || 0;
        const awayWeekly = teamWeeklyCounts.get(awayId).get(weekNumber) || 0;
        if (homeWeekly >= 3 || awayWeekly >= 3) continue;

        // Check daily availability
        if (teamAvailability.get(homeId).has(slotDateStr)) continue;
        if (teamAvailability.get(awayId).has(slotDateStr)) continue;

        // Create and save game
        const game = new Game({
          date: slotDate,
          time: slot.time,
          field: slot.field,
          homeTeam: home._id,
          awayTeam: away._id,
          division: division._id,
          gameslot: slot._id,
        });
        await game.save();

        // Update slot
        await Gameslot.updateOne(
          { _id: slot._id },
          { $set: { game: game._id } }
        );

        // Update tracking
        teamTotalGames.set(homeId, teamTotalGames.get(homeId) + 1);
        teamTotalGames.set(awayId, teamTotalGames.get(awayId) + 1);

        teamAvailability.get(homeId).add(slotDateStr);
        teamAvailability.get(awayId).add(slotDateStr);

        teamWeeklyCounts.get(homeId).set(weekNumber, homeWeekly + 1);
        teamWeeklyCounts.get(awayId).set(weekNumber, awayWeekly + 1);

        // Update schedule and division
        schedule.games.push(game._id);
        // division.games.push(game._id);
        // await division.save();
        await schedule.save();

        // Mark slot as used in local array
        slot.game = game._id;
        break;
      }
    }
    await season.save();

    console.log("Schedule generation complete!");
    res.json({
      message: "Schedule generated successfully",
      schedule: schedule,
    });
    //print every game in the schedule
    // Deleted this for now - its not required because the games will be populated in the get request
    // for (let i = 0; i < schedule.games.length; i++) {
    //   let game = await Game.findById(schedule.games[i]).populate(
    //     "date time field"
    //   );
    // }
  } catch (error) {
    console.error("Error generating schedule:", error);
    res.status(500).json({ error: "Failed to generate schedule" });
  }
};

const generateGameSlots = async (schedule, startDate, endDate) => {
  const gameSlotTimes = ["5:00 PM", "6:30 PM", "8:00 PM", "9:30 PM"];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
      // Weekdays
      for (let fieldNum = 1; fieldNum <= 3; fieldNum++) {
        for (const time of gameSlotTimes) {
          const gameslot = new Gameslot({
            date: new Date(currentDate),
            time: time,
            field: `Field ${fieldNum}`,
            schedule: schedule._id,
          });
          await gameslot.save();
          schedule.gameSlots.push(gameslot._id);
        }
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  await schedule.save();
};

// New generateDivisionPairings function that generates pairings in a round-robin fashion
// this shuffles the order of games and improves the runtime as well

const generateDivisionPairings = (teams) => {
  const pairings = [];
  const n = teams.length;
  const gamesPerTeam = 20;
  const gamesPerRound = Math.floor(n / 2);
  const totalGames = (gamesPerTeam * n) / 2;

  let round = 0;
  const homeGamesCount = {};

  // Initialize home count for each team
  teams.forEach((team) => (homeGamesCount[team] = 0));

  while (pairings.length < totalGames) {
    for (let i = 0; i < gamesPerRound; i++) {
      let homeTeam = teams[i];
      let awayTeam = teams[n - 1 - i];

      // Swap home/away if one team has more home games
      if (homeGamesCount[homeTeam] > homeGamesCount[awayTeam]) {
        [homeTeam, awayTeam] = [awayTeam, homeTeam];
      }

      pairings.push([homeTeam, awayTeam]);

      // Update home count
      homeGamesCount[homeTeam]++;
    }

    // Rotate teams (except the first one) for Round Robin Algo
    teams = [teams[0], ...teams.slice(2).concat(teams[1])];
    round++;
  }
  return pairings;
};

const getWeekNumber = (date, startDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  const diffTime = current - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// const assignDivisionGames = async (pairings, schedule, division, seasonStartDate) => {
//   const availableSlots = await Gameslot.find({
//     schedule: schedule._id,
//     game: null,
//   }).sort("date time");

//   const teamAvailability = new Map();
//   const teamWeeklyCounts = new Map(); // Track games per week per team
//   const teamTotalGames = new Map(); // Tracks total games per team

//   // Initialize total games count for each team
//   division.teams.forEach((team) => {
//     teamTotalGames.set(team._id, 0);
//   });

//   // Shuffle pairings to distribute games more evenly
//   const shuffledPairings = shuffleArray(pairings);

//   for (const [homeTeam, awayTeam] of shuffledPairings) {
//     if (
//       teamTotalGames.get(homeTeam._id) >= 20 ||
//       teamTotalGames.get(awayTeam._id) >= 20
//     ) {
//       continue;
//     }

//     for (const slot of availableSlots) {
//       if (slot.game) continue;

//       const slotDate = slot.date;
//       const weekNumber = getWeekNumber(slotDate, seasonStartDate);

//       // Get current weekly counts for both teams
//       const homeCount = teamWeeklyCounts.get(homeTeam._id)?.get(weekNumber) || 0;
//       const awayCount = teamWeeklyCounts.get(awayTeam._id)?.get(weekNumber) || 0;

//       // Check if either team exceeds the weekly limit (3 games)
//       if (homeCount >= 3 || awayCount >= 3) continue;

//       // Existing check for same-day games
//       const slotDateStr = slotDate.toISOString().split('T')[0];
//       const homeBusy = teamAvailability.get(homeTeam._id)?.has(slotDateStr);
//       const awayBusy = teamAvailability.get(awayTeam._id)?.has(slotDateStr);

//       if (!homeBusy && !awayBusy) {
//         // Create game
//         const game = new Game({
//           date: slot.date,
//           time: slot.time,
//           field: slot.field,
//           homeTeam: homeTeam._id,
//           awayTeam: awayTeam._id,
//           division: division._id,
//           gameslot: slot._id,
//         });
//         await game.save();

//         // Update slot and schedule
//         slot.game = game._id;
//         await slot.save();
//         schedule.games.push(game._id);
//         division.games = division.games || [];
//         division.games.push(game._id);
//         await division.save();

//         // Update team availability for the day
//         teamAvailability.set(
//           homeTeam._id,
//           (teamAvailability.get(homeTeam._id) || new Set()).add(slotDateStr)
//         );
//         teamAvailability.set(
//           awayTeam._id,
//           (teamAvailability.get(awayTeam._id) || new Set()).add(slotDateStr)
//         );

//         // Update weekly game counts
//         if (!teamWeeklyCounts.has(homeTeam._id)) {
//           teamWeeklyCounts.set(homeTeam._id, new Map());
//         }
//         teamWeeklyCounts.get(homeTeam._id).set(weekNumber, homeCount + 1);
//         // print the team's weekly count
//         // console.log(`Team ${homeTeam._id.populate('Name')} has ${homeCount + 1} games in week ${weekNumber}`);

//         if (!teamWeeklyCounts.has(awayTeam._id)) {
//           teamWeeklyCounts.set(awayTeam._id, new Map());
//         }
//         teamWeeklyCounts.get(awayTeam._id).set(weekNumber, awayCount + 1);
//         // print the team's weekly count
//         // console.log(`Team ${awayTeam._id.populate('Name')} has ${awayCount + 1} games in week ${weekNumber}`);

//         // console.log("\n=====================================\n");

//         // Update total games count
//         teamTotalGames.set(homeTeam._id, teamTotalGames.get(homeTeam._id) + 1);
//         teamTotalGames.set(awayTeam._id, teamTotalGames.get(awayTeam._id) + 1);

//         break; // Move to next pairing after assigning a slot
//       }
//     }
//   }
//   await schedule.save();
// };

// const assignDivisionGames = async (pairings, schedule, division) => {
//   const availableSlots = await Gameslot.find({
//     schedule: schedule._id,
//     game: null,
//   }).sort("date time");

//   const teamAvailability = new Map();
//   for (const [homeTeam, awayTeam] of pairings) {
//     /* TODO: Implement the algorithm to assign games to available slots
//     This might be slow and also we need to space out games throughout the season

//     Also, this currently does Division by Division, which means one division will
//     be fully scheduled before moving to the next division - NOT GOOD. */

//     for (const slot of availableSlots) {
//       if (slot.game) continue;

//       // Convert to comparable date string
//       const slotDate = slot.date.toISOString().split("T")[0];

//       // Check team availabilitya
//       const homeTeamBusy = teamAvailability.get(homeTeam._id)?.has(slotDate);
//       const awayTeamBusy = teamAvailability.get(awayTeam._id)?.has(slotDate);

//       if (!homeTeamBusy && !awayTeamBusy) {
//         // Create game
//         const game = new Game({
//           date: slot.date,
//           time: slot.time,
//           field: slot.field,
//           homeTeam: homeTeam._id,
//           awayTeam: awayTeam._id,
//           division: division._id,
//           gameslot: slot._id,
//         });
//         await game.save();

//         // Update slot and schedule
//         slot.game = game._id;
//         await slot.save();
//         schedule.games.push(game._id);
//         division.games = division.games || [];
//         division.games.push(game._id);
//         await division.save();

//         // Update availability tracking
//         teamAvailability.set(
//           homeTeam._id,
//           (teamAvailability.get(homeTeam._id) || new Set()).add(slotDate)
//         );
//         teamAvailability.set(
//           awayTeam._id,
//           (teamAvailability.get(awayTeam._id) || new Set()).add(slotDate)
//         );
//         break;
//       }
//     }
//   }
//   await schedule.save();
// };
const getScheduleBySeasonId = async (req, res, next) => {
  const seasonId = req.params.sid;

  let schedule;
  try {
    schedule = await Schedule.findOne({ seasonId: seasonId }).populate({
      path: "games",
      populate: [
        { path: "homeTeam" },
        { path: "awayTeam" },
        { path: "division" },
      ],
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching schedule failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!schedule) {
    const error = new HttpError(
      `Could not find a schedule for the provided seasonId: ${seasonId}.`,
      404
    );
    return next(error);
  }

  res.json({
    schedule: schedule.toObject({ getters: true }),
  });
};

module.exports = {
  generateSchedule,
  getAllSchedules,
  getScheduleById,
  deleteSchedule,
  getScheduleBySeasonId,
};
