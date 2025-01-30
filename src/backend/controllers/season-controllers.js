const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Season = require("../models/season");

const getUpcomingSeasons = async (req, res, next) => {
  let seasons;
  try {
    seasons = await Season.find({ status: 'upcoming' }); 
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
    seasons = await Season.find({ status: 'ongoing' });
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
    seasons = await Season.find({ status: 'archived' });
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
  console.log(errors)
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
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingSeason) {
    const error = new HttpError(
      "Season name exists already.",
      422
    );
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

  res
    .status(201)
    .json({
      seasonId: createdSeason.id,
    });
};

exports.getUpcomingSeasons = getUpcomingSeasons;
exports.getOngoingSeasons = getOngoingSeasons;
exports.getArchivedSeasons = getArchivedSeasons;
exports.createSeason = createSeason;
