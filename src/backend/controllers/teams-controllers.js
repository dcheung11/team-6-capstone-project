const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Team = require("../models/team");
const Season = require("../models/season");
const Division = require("../models/division");

const getTeams = async (req, res, next) => {
  let teams;
  try {
    teams = await Team.find();
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
  const { name, division, captainId, roster } = req.body;

  let existingTeam;
  try {
    existingTeam = await Team.findOne({ name: name, division: division });
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
    division,
    roster: roster || [], // Default to empty array if not provided
    captainId,
  });

  try {
    await createdTeam.save();
    // Add team to season
    const season = await Season.find({ status: "upcoming" });
    season.registeredTeams.push(createdTeam);
    await season.save();

    // Add team to division
    const division = await Division.findOne({ name: division });
    division.teams.push(createdTeam);
  } catch (err) {
    const error = new HttpError("2 Creating team failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ team: createdTeam });
};

const getTeamsById = async (req, res, next) => {
  const teamIds = req.params.id.split(",");

  let teams;
  try {
    teams = await Team.find({ _id: { $in: teamIds } });
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
    teams: teams.map((team) =>
      team.toObject({ getters: true })
    ),
  });
};

exports.getTeams = getTeams;
exports.registerTeam = registerTeam;
exports.getTeamsById = getTeamsById;