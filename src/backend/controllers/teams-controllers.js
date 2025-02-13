const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Team = require("../models/team");
const Season = require("../models/season");
const Division = require("../models/division");
const season = require("../models/season");
const Player = require("../models/player");

const getTeams = async (req, res, next) => {
  let teams;
  try {
    teams = await Team.find()
      .populate("divisionId") // Populating division
      .populate("roster") // Populating the roster of players
      .populate("captainId") // Populating captain
      .populate("seasonId"); // Po;
  } catch (err) {
    const error = new HttpError("Fetching teams failed, please try again later.", 500);
    return next(error);
  }
  res.json({
    teams: teams.map((team) => team.toObject({ getters: true })),
  });
};

const registerTeam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }
  const { name, divisionId, captainId, roster, seasonId } = req.body;

  let existingTeam;
  try {
    existingTeam = await Team.findOne({
      name: name,
      divisionId: divisionId,
      seasonId: seasonId,
    });
  } catch (err) {
    const error = new HttpError("1 Creating team failed, please try again.", 500);
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
  });

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
    const error = new HttpError("2 Creating team failed, please try again.", 500);
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
    const error = new HttpError("Fetching teams failed, please try again later.", 500);
    return next(error);
  }

  if (!teams || teams.length === 0) {
    const error = new HttpError("Could not find team(s) for the provided id(s).", 404);
    return next(error);
  }

  res.json({
    teams: teams.map((team) => team.toObject({ getters: true })),
  });
};

exports.getTeams = getTeams;
exports.registerTeam = registerTeam;
exports.getTeamsById = getTeamsById;
