const mongoose = require("mongoose");
const Schedule = require("../models/schedule");
const Gameslot = require("../models/gameslot");
const Game = require("../models/game");
const Season = require("../models/season");
const Division = require("../models/division");
const HttpError = require("../models/http-error");
const {
  generateGameSlots,
  generateDivisionPairings,
  assignDivisionGames,
} = require("../schedule-algorithm/helpers");

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
        // Bulk Clean
        await Game.deleteMany({ _id: { $in: oldSchedule.games } });

        await Gameslot.updateMany(
          { game: { $in: oldSchedule.games } },
          { $set: { game: null } }
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
    await generateGameSlots(season.startDate, season.endDate);

    console.log("Starting pairings generation");
    // Process each division
    const allDivisionPairings = [];
    let allTeams = [];
    for (const divisionId of season.divisions) {
      const division = await Division.findById(divisionId).populate("teams");
      if (!division || division.teams.length < 2) continue;

      const teams = division.teams;
      allTeams = allTeams.concat(teams);
      const pairings = generateDivisionPairings(teams);
      allDivisionPairings.push({
        division,
        pairings: [...pairings],
      });
    }
    console.log("Starting games assignment...");
    await assignDivisionGames(allDivisionPairings, schedule, season, allTeams);
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
