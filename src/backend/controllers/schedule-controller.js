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
    const { seasonId } = req.body;

    if (!seasonId) return res.status(400).json({ error: "Season ID required" });

    // create season object from seasonId and populate divisions to have division objects
    const season = await Season.findById(seasonId)
      .populate("divisions")
      .populate("schedule");

    // Find or create season-level schedule
    let schedule = season.schedule;

    if (schedule) {
      // If a schedule already exists, delete the old games and the schedule - prevents duplicates
      const oldSchedule = await Schedule.findById(season.schedule);
      if (oldSchedule) {
        console.log(`Deleting old schedule: ${oldSchedule._id}...`);
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
        console.log(`Deleted old schedule: ${oldSchedule._id}`);
      }
    } else {
      // No existing schedule, so create a new one
      schedule = new Schedule({ seasonId: seasonId });
      await schedule.save();

      season.schedule = schedule._id;
      await season.save();
    }

    // Generate global gameslots once
    if (schedule.gameSlots.length === 0) {
      await generateGameSlots(schedule, season.startDate, season.endDate);
    }
    console.log("Starting pairings generation");
    // Process each division
    const allDivisionPairings = [];
    for (const divisionId of season.divisions) {
      const division = await Division.findById(divisionId).populate("teams");
      if (!division || division.teams.length < 2) continue;

      const teams = division.teams;
      const pairings = generateDivisionPairings(teams);
      allDivisionPairings.push({
        division,
        pairings: [...pairings],
      });
    }
    console.log("Starting games assignment...");
    await assignDivisionGames(allDivisionPairings, schedule, season);
    console.log("Finished games assignment.");

    await season.save();

    console.log("Schedule generation complete!");
    res.json({
      message: "Schedule generated successfully",
      schedule: schedule,
    });
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

// Interleaves pairings from all divisions to ensure a distribution of games and not games sequentilly played by division
const interleavePairings = (allDivisionPairings) => {
  const allPairings = [];

  // Find the maximum number of pairings across all divisions
  const maxPairings = Math.max(
    ...allDivisionPairings.map((dp) => dp.pairings.length)
  );

  // Iterate through each index and interleave pairings
  for (let i = 0; i < maxPairings; i++) {
    allDivisionPairings.forEach(({ division, pairings }) => {
      if (i < pairings.length) {
        const [homeTeam, awayTeam] = pairings[i];
        allPairings.push({ division, homeTeam, awayTeam });
      }
    });
  }
  return allPairings;
};

// WIP - seems to work for demo season
const calculateMaxGamesPerWeek = (startDate, endDate, totalGamesPerTeam) => {
  const seasonDurationInDays = Math.ceil(
    (endDate - startDate) / (1000 * 60 * 60 * 24)
  );
  const numberOfWeeks = Math.ceil(seasonDurationInDays / 7);
  const maxGamesPerWeek = Math.floor(totalGamesPerTeam / numberOfWeeks);
  return maxGamesPerWeek;
};

const getWeekNumber = (date, seasonStartDate) => {
  const diffInDays = Math.floor(
    (date - seasonStartDate) / (1000 * 60 * 60 * 24)
  );
  return Math.floor(diffInDays / 7) + 1; // Week 1, Week 2, etc.
};

// allDivisionPairs is an array of objects, each containing a division and its pairings
const assignDivisionGames = async (allDivisionPairings, schedule, season) => {
  const availableSlots = await Gameslot.find({
    schedule: schedule._id,
    game: null,
  }).sort("date time");

  // flatten all pairings into a single array, alternrating between divisions
  const interleavedPairings = interleavePairings(allDivisionPairings);

  const teamAvailability = new Map();
  const teamWeeklyCounts = new Map(); // { teamId: { week1: 1, week2: 2, ... } }
  const MAX_GAMES_PER_WEEK = calculateMaxGamesPerWeek(
    season.startDate,
    season.endDate,
    20
  );

  // Batch operations
  const gamesToCreate = [];
  const slotsToUpdate = [];

  for (const slot of availableSlots) {
    if (interleavedPairings.length === 0) break; // Stop if no more pairings are left
    const slotDate = slot.date.toISOString().split("T")[0];
    const weekNumber = getWeekNumber(slot.date, season.startDate);
    // Find the first valid pairing for this slot
    const pairingIndex = interleavedPairings.findIndex(
      ({ homeTeam, awayTeam }) => {
        // Check weekly game limits
        const homeTeamGamesThisWeek =
          teamWeeklyCounts.get(homeTeam._id)?.[weekNumber] || 0;
        const awayTeamGamesThisWeek =
          teamWeeklyCounts.get(awayTeam._id)?.[weekNumber] || 0;

        if (
          homeTeamGamesThisWeek >= MAX_GAMES_PER_WEEK &&
          awayTeamGamesThisWeek >= MAX_GAMES_PER_WEEK
        ) {
          return false; 
        }

        // Check team availability
        const homeTeamBusy = teamAvailability.get(homeTeam._id)?.has(slotDate);
        const awayTeamBusy = teamAvailability.get(awayTeam._id)?.has(slotDate);

        return !homeTeamBusy && !awayTeamBusy;
      }
    );

    if (pairingIndex !== -1) {
      // Assign the game to the slot
      const { division, homeTeam, awayTeam } =
        interleavedPairings[pairingIndex];

      const game = new Game({
        date: slot.date,
        time: slot.time,
        field: slot.field,
        homeTeam: homeTeam._id,
        awayTeam: awayTeam._id,
        division: division._id,
        gameslot: slot._id,
      });
      gamesToCreate.push(game);

      slotsToUpdate.push({
        _id: slot._id,
        game: game._id,
      });

      // Update availability tracking
      teamAvailability.set(
        homeTeam._id,
        (teamAvailability.get(homeTeam._id) || new Set()).add(slotDate)
      );
      teamAvailability.set(
        awayTeam._id,
        (teamAvailability.get(awayTeam._id) || new Set()).add(slotDate)
      );

      // Update games per week tracking
      if (!teamWeeklyCounts.has(homeTeam._id))
        teamWeeklyCounts.set(homeTeam._id, {});
      if (!teamWeeklyCounts.has(awayTeam._id))
        teamWeeklyCounts.set(awayTeam._id, {});
      teamWeeklyCounts.get(homeTeam._id)[weekNumber] =
        (teamWeeklyCounts.get(homeTeam._id)[weekNumber] || 0) + 1;
      teamWeeklyCounts.get(awayTeam._id)[weekNumber] =
        (teamWeeklyCounts.get(awayTeam._id)[weekNumber] || 0) + 1;

      // Remove the assigned pairing from the list
      interleavedPairings.splice(pairingIndex, 1);
    }
  }

  // Batch operations (saves time to do all at the end)
  const createdGames = await Game.insertMany(gamesToCreate);

  const updateOperations = slotsToUpdate.map((slot) => ({
    updateOne: {
      filter: { _id: slot._id }, // Filter by slot ID
      update: { $set: { game: slot.game } }, // Set the game field
    },
  }));
  await Gameslot.bulkWrite(updateOperations);

  schedule.games.push(...createdGames.map((g) => g._id));
  await schedule.save();

  for (const game of createdGames) {
    const division = allDivisionPairings.find(
      (dp) => dp.division._id === game.division
    ).division;
    division.games = division.games || [];
    division.games.push(game._id);
    await division.save();
  }

  // By iterating over allDivisionPairings, we can avoid scheduling division games sequentially
  const sortedGames = await Game.find({ _id: { $in: schedule.games } }).sort(
    "date time"
  );
  schedule.games = sortedGames.map((game) => game._id);
  await schedule.save();
};
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
