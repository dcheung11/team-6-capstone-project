const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Team = require("../models/team");
const Season = require("../models/season");
const Division = require("../models/division");
const Player = require("../models/player");
const { updateStandings } = require("./standings-controller");

const getTeams = async (req, res, next) => {
  let teams;
  try {
    teams = await Team.find()
      .populate("divisionId") // Populating division
      .populate("roster") // Populating the roster of players
      .populate("captainId") // Populating captain
      .populate("seasonId"); // Po;
  } catch (err) {
    const error = new HttpError(
      "Fetching teams failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    teams: teams.map((team) => team.toObject({ getters: true })),
  });
};

const registerTeam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const {
    name,
    divisionId,
    captainId,
    roster,
    seasonId,
    preferredTimes,
    blacklistDays,
  } = req.body;

  let existingTeam;
  try {
    const existingTeam = await Team.findOne({ captainId, seasonId });
    if (existingTeam) {
      return next(new HttpError("Captains can only manage one team per season.", 403));
    }

    const duplicateTeam = await Team.findOne({ name, divisionId, seasonId });
    if (duplicateTeam) {
      return next(new HttpError("Team name already exists in this division and season.", 422));
    }

  } catch (err) {
    const error = new HttpError(
      "1 Creating team failed, please try again.",
      500
    );
    return next(error);
  }

  if (existingTeam) {
    const error = new HttpError("Team name already exists.", 422);
    return next(error);
  }

  const createdTeam = new Team({
    name,
    divisionId,
    roster: roster || [], // Default to empty array if not provided
    captainId,
    seasonId,
    preferredTimes: preferredTimes || "Balanced",
    blacklistDays: blacklistDays || "None",
  });

  // console.log(createdTeam);

  try {
    await createdTeam.save();
    // Add team to season
    const season = await Season.findById(seasonId);
    season.registeredTeams.push(createdTeam._id);
    await season.save();

    // Add team to division
    const division = await Division.findById(divisionId);
    division.teams.push(createdTeam);
  } catch (err) {
    const error = new HttpError(
      "2 Creating team failed, please try again.",
      500
    );
    return next(error);
  }

  // Now associate the captain and players with the created team
  const captain = await Player.findById(captainId);
  if (!captain) {
    const error = new HttpError("Captain not found.", 404);
    return next(error);
  }

  // Update captain's team
  captain.team = createdTeam._id;
  await captain.save();

  // STANDINGS: new team needs to be added to standings
  try {
    console.log("Trying updateStandings");
    await updateStandings(createdTeam.divisionId);
    
  } catch (err) {
    console.error("Error updating standings:", err);
    return next(new HttpError("Failed to update standings", 500))
  }

  res.status(201).json({ team: createdTeam });

};

const getTeamsById = async (req, res, next) => {
  const teamIds = req.params.id.split(",");

  let teams;
  try {
    teams = await Team.find({ _id: { $in: teamIds } })
      .populate("divisionId")
      .populate("roster")
      .populate("captainId")
      .populate("seasonId");
  } catch (err) {
    const error = new HttpError(
      "Fetching teams failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!teams || teams.length === 0) {
    const error = new HttpError(
      "Could not find team(s) for the provided id(s).",
      404
    );
    return next(error);
  }

  res.json({
    teams: teams.map((team) => team.toObject({ getters: true })),
  });
};

const getScheduleGamesByTeamId = async (req, res, next) => {
  const teamId = req.params.id;

  let team;
  try {
    team = await Team.findById(teamId);
  } catch (err) {
    const error = new HttpError(
      "Fetching team failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!team) {
    const error = new HttpError(
      "Could not find team for the provided id.",
      404
    );
    return next(error);
  }

  let season;
  try {
    season = await Season.findById(team.seasonId).populate({
      path: "schedule", // Populate the schedule array
      populate: {
        path: "games", // Populate the games array inside schedule
        populate: [
          { path: "homeTeam" },
          { path: "awayTeam" },
          { path: "division" }, // Populate division inside games
        ],
      },
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching schedule failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!season) {
    const error = new HttpError(
      "Could not find schedule for the provided team id.",
      404
    );
    return next(error);
  }

  // filter schedule to return only games for the team
  const games = season.schedule?.games?.filter(
    (game) =>
      game.homeTeam._id.toString() === teamId ||
      game.awayTeam._id.toString() === teamId
  ) || [];

  res.json({
    games: games.map((game) => game.toObject({ getters: true })),
  });
};

exports.getTeams = getTeams;
exports.registerTeam = registerTeam;
exports.getTeamsById = getTeamsById;
exports.getScheduleGamesByTeamId = getScheduleGamesByTeamId;
