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
    const schedule = await Schedule.findById(req.params.id).populate(
      "games division season"
    );
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

    console.log("seasonId: ", seasonId);

    if (!seasonId) return res.status(400).json({ error: "Season ID required" });

    // create season object from seasonId and populate divisions to have division objects
    const season = await Season.findById(seasonId)
      .populate("divisions")
      .populate("schedule");

    console.log("season: ", season);

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
      console.log("New season schedule created: ", season);
    }

    // Generate global gameslots once
    if (schedule.gameSlots.length === 0) {
      await generateGameSlots(schedule, season.startDate, season.endDate);
    }

    // Process each division
    for (const divisionId of season.divisions) {
      const division = await Division.findById(divisionId).populate("teams");
      if (!division || division.teams.length < 2) continue;

      const teams = division.teams;
      const pairings = generateDivisionPairings(teams);
      await assignDivisionGames(pairings, schedule, division);
    }

    console.log("Schedule generation complete!");
    res.json({
      message: "Schedule generated successfully",
      schedule: schedule,
    });
    console.log("Fully generated schedule: \n");
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

// const generateDivisionPairings = (teams) => {
//   const pairings = [];
//   const n = teams.length;
//   const matchupsPerOpponent = Math.ceil(20 / (n - 1));

//   // Generate all possible pairs
//   for (let i = 0; i < n; i++) {
//     for (let j = i + 1; j < n; j++) {
//       // Add pair multiple times to reach required games
//       for (let k = 0; k < matchupsPerOpponent; k++) {
//         pairings.push([teams[i], teams[j]]);
//       }
//     }
//   }
//   return pairings;
// };

// New generateDivisionPairings function that generates pairings in a round-robin fashion
// this shuffles the order of games and improves the runtime as well

const generateDivisionPairings = (teams) => {
  const pairings = [];
  const n = teams.length;
  const gamesPerTeam = 20; // Each team should play 20 games
  const gamesPerRound = Math.floor(n / 2); // Number of games in each round
  const totalGames = (gamesPerTeam * n) / 2;

  let round = 0;

  // Roundrobin - Generate pairings until each team reaches the required games
  while (pairings.length < totalGames) {
    for (let i = 0; i < gamesPerRound; i++) {
      const team1 = teams[i];
      const team2 = teams[n - 1 - i];
      pairings.push([team1, team2]);
    }

    // Rotate teams (except the first one) for the next round
    teams.push(teams.shift());
    round++;
  }
  return pairings;
};

const assignDivisionGames = async (pairings, schedule, division) => {
  const availableSlots = await Gameslot.find({
    schedule: schedule._id,
    game: null,
  }).sort("date time");

  const teamAvailability = new Map();
  for (const [team1, team2] of pairings) {
    
    /* TODO: Implement the algorithm to assign games to available slots
    This might be slow and also we need to space out games throughout the season

    Also, this currently does Division by Division, which means one division will 
    be fully scheduled before moving to the next division - NOT GOOD. */

    for (const slot of availableSlots) {
      if (slot.game) continue;

      // Convert to comparable date string
      const slotDate = slot.date.toISOString().split("T")[0];

      // Check team availability
      const t1Busy = teamAvailability.get(team1._id)?.has(slotDate);
      const t2Busy = teamAvailability.get(team2._id)?.has(slotDate);

      if (!t1Busy && !t2Busy) {
        // Create game
        const game = new Game({
          date: slot.date,
          time: slot.time,
          field: slot.field,
          team1: team1._id,
          team2: team2._id,
          division: division._id,
          gameslot: slot._id,
        });
        await game.save();

        // Update slot and schedule
        slot.game = game._id;
        await slot.save();
        schedule.games.push(game._id);
        division.games = division.games || [];
        division.games.push(game._id);
        await division.save();

        // Update availability tracking
        teamAvailability.set(
          team1._id,
          (teamAvailability.get(team1._id) || new Set()).add(slotDate)
        );
        teamAvailability.set(
          team2._id,
          (teamAvailability.get(team2._id) || new Set()).add(slotDate)
        );
        break;
      }
    }
  }
  await schedule.save();
};
const getScheduleBySeasonId = async (req, res, next) => {
  const seasonId = req.params.sid;

  let schedule;
  try {
    schedule = await Schedule.findOne({ seasonId: seasonId }).populate({
      path: "games",
      populate: [{ path: "team1" }, { path: "team2" }, { path: "division" }],
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
