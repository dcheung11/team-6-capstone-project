const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Division = require("../models/division");
const Season = require("../models/season");

const createDivision = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { seasonId, name, teams } = req.body;

  let season;
  try {
    season = await Season.findById(seasonId);
  } catch (err) {
    const error = new HttpError(
      "Fetching season failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!season) {
    const error = new HttpError("Could not find season for provided id.", 404);
    return next(error);
  }

  const createdDivision = new Division({
    name,
    teams,
    seasonId,
  });

  try {
    await createdDivision.save();
    season.divisions.push(createdDivision._id);
    await season.save();
  } catch (err) {
    console.error(err);
    return next(
      new HttpError("Creating division failed, please try again.", 500)
    );
  }

  res.status(201).json({ division: createdDivision });
};
const getDivisionById = async (req, res, next) => {
  const divisionIds = req.params.id.split(",");

  let divisions;
  try {
    // Fetching multiple divisions if more than one ID is provided
    divisions = await Division.find({ _id: { $in: divisionIds } });
  } catch (err) {
    const error = new HttpError(
      "Fetching divisions failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!divisions || divisions.length === 0) {
    const error = new HttpError(
      "Could not find division(s) for the provided id(s).",
      404
    );
    return next(error);
  }

  res.json({
    divisions: divisions.map((division) =>
      division.toObject({ getters: true })
    ),
  });
};

const updateDivisionTeams = async (req, res, next) => {
  const divisionId = req.params.id;
  const { teams } = req.body;

  let division;
  try {
    division = await Division.findById(divisionId);
  } catch (err) {
    const error = new HttpError(
      "Fetching division failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!division) {
    const error = new HttpError(
      "Could not find division for provided id.",
      404
    );
    return next(error);
  }

  division.teams = teams;

  try {
    await division.save();
  } catch (err) {
    return next(
      new HttpError("Updating division failed, please try again later.", 500)
    );
  }

  let season;
  try {
    season = await Season.findById(division.seasonId).populate("divisions");
  } catch (err) {
    return next(
      new HttpError("Fetching season failed, please try again later.", 500)
    );
  }

  res.status(200).json({ division: division.toObject({ getters: true }) });
};

exports.createDivision = createDivision;
exports.updateDivisionTeams = updateDivisionTeams;
exports.getDivisionById = getDivisionById;
