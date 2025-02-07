const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Season = require("../models/season");
const Division = require("../models/division");

const getUpcomingSeasons = async (req, res, next) => {
  let seasons;
  try {
    seasons = await Season.find({ status: "upcoming" });
  } catch (err) {
    const error = new HttpError(
      "Fetching open seasons failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    seasons: seasons.map((season) => season.toObject({ getters: true })),
  });
};

const getOngoingSeasons = async (req, res, next) => {
  let seasons;
  try {
    seasons = await Season.find({ status: "ongoing" });
  } catch (err) {
    const error = new HttpError(
      "Fetching ongoing seasons failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    seasons: seasons.map((season) => season.toObject({ getters: true })),
  });
};

const getArchivedSeasons = async (req, res, next) => {
  let seasons;
  try {
    seasons = await Season.find({ status: "archived" });
  } catch (err) {
    const error = new HttpError(
      "Fetching archived seasons failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    seasons: seasons.map((season) => season.toObject({ getters: true })),
  });
};

const createSeason = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, startDate, endDate, allowedDivisions } = req.body;

  let existingSeason;
  try {
    existingSeason = await Season.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      "Creating failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingSeason) {
    const error = new HttpError("Season name exists already.", 422);
    return next(error);
  }

  const createdSeason = new Season({
    name,
    startDate,
    endDate,
    allowedDivisions: allowedDivisions || 4,
    divisions: [],
    status: "upcoming",
  });

  try {
    await createdSeason.save();
  } catch (err) {
    const error = new HttpError("Create Season failed, please try again.", 500);
    return next(error);
  }

  const divisionPromises = [];
  for (let i = 1; i <= (allowedDivisions || 4); i++) {
    const division = new Division({
      name: `Division ${i}`,
      seasonId: createdSeason._id,
      teams: [], // Empty teams for now
    });
    divisionPromises.push(division.save());
  }

  try {
    const divisions = await Promise.all(divisionPromises);
    createdSeason.divisions = divisions.map((division) => division._id);
    await createdSeason.save(); // Update season with division IDs
  } catch (err) {
    const error = new HttpError(
      "Creating divisions failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    seasonId: createdSeason.id,
  });
};

const getAllSeasons = async (req, res, next) => {
  let seasons;
  try {
    seasons = await Season.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching seasons failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    seasons: seasons.map((season) => season.toObject({ getters: true })),
  });
};

const deleteSeason = async (req, res, next) => {
  const seasonId = req.params.sid;

  let season;
  try {
    season = await Season.findById(seasonId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete season.",
      500
    );
    return next(error);
  }

  if (!season) {
    const error = new HttpError("Could not find season for this id.", 404);
    return next(error);
  }

  try {
    await season.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete season.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted season." });
};

const getSeasonById = async (req, res, next) => {
  const seasonId = req.params.sid;

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
    const error = new HttpError(
      "Could not find season for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ season: season.toObject({ getters: true }) });
};

exports.getUpcomingSeasons = getUpcomingSeasons;
exports.getOngoingSeasons = getOngoingSeasons;
exports.getArchivedSeasons = getArchivedSeasons;
exports.createSeason = createSeason;
exports.getAllSeasons = getAllSeasons;
exports.deleteSeason = deleteSeason;
exports.getSeasonById = getSeasonById;
