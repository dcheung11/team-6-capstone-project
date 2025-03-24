const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Season = require("../models/season");
const Division = require("../models/division");

const getUpcomingSeasons = async (req, res, next) => {
  let seasons;
  try {
    seasons = await Season.find({ status: "upcoming" })
      .populate({
        path: "divisions",
      })
      .populate({
        path: "registeredTeams",
        populate: [{ path: "captainId" }, { path: "roster" }],
      });
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
    seasons = await Season.find({ status: "ongoing" })
      .populate({
        path: "divisions",
      })
      .populate({
        path: "registeredTeams",
        populate: [{ path: "captainId" }, { path: "roster" }],
      })
      .populate({
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
    seasons = await Season.find({ status: "archived" })
      .populate({
        path: "divisions",
      })
      .populate({
        path: "registeredTeams",
        populate: [{ path: "captainId" }, { path: "roster" }],
      });
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
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, startDate, endDate, allowedDivisions } = req.body;

  try {
    // Check if a season with the same name exists
    const existingSeason = await Season.findOne({ name: name });
    if (existingSeason) {
      return next(new HttpError("Season name already exists.", 422));
    }

    // Check if the new season overlaps with any existing season
    const overlappingSeason = await Season.findOne({
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Overlapping condition
      ],
    });

    if (overlappingSeason) {
      return next(
        new HttpError("A season already exists within this time range.", 422)
      );
    }

    // Create new season
    const createdSeason = new Season({
      name,
      startDate,
      endDate,
      allowedDivisions: allowedDivisions || 4,
      divisions: [],
      status: "upcoming",
    });

    await createdSeason.save();

    // Create divisions
    const divisionPromises = [];
    for (let i = 1; i <= (allowedDivisions || 4); i++) {
      const division = new Division({
        name: `Division ${i}`,
        seasonId: createdSeason._id,
        teams: [],
      });
      divisionPromises.push(division.save());
    }

    const divisions = await Promise.all(
      divisionPromises.map((p) => p.catch((err) => err))
    );
    createdSeason.divisions = divisions.map((division) => division._id);
    await createdSeason.save();

    res.status(201).json({ seasonId: createdSeason.id });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }
};

const getAllSeasons = async (req, res, next) => {
  let seasons;
  try {
    seasons = await Season.find()
      .populate({
        path: "divisions",
      })
      .populate({
        path: "registeredTeams",
        populate: [{ path: "captainId" }, { path: "roster" }],
      });
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
    season = await Season.findById(seasonId)
      .populate({
        path: "divisions",
      })
      .populate({
        path: "registeredTeams",
        populate: [{ path: "captainId" }, { path: "roster" }],
      });
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

const updateSeasonDivisionTeams = async (req, res, next) => {
  const seasonId = req.params.sid;
  const { divisions } = req.body;

  let season;
  try {
    season = await Season.findById(seasonId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update season.",
      500
    );
    return next(error);
  }

  if (!season) {
    const error = new HttpError("Could not find season for this id.", 404);
    return next(error);
  }

  // Iterate over the divisions in the request body
  for (const updatedDivision of divisions) {
    const division = await Division.findById(updatedDivision.id);

    if (!division) {
      const error = new HttpError("Could not find division for this id.", 404);
      return next(error);
    }

    // Update the teams for this division
    division.teams = updatedDivision.teams;

    try {
      await division.save();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not update division.",
        500
      );
      return next(error);
    }
  }

  // update the season's divisions with the new division ids
  season.divisions = divisions.map((updatedDivision) => updatedDivision.id);

  try {
    await season.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update season.",
      500
    );
    return next(error);
  }

  res.status(200).json({ season: season.toObject({ getters: true }) });
};

const updateToOngoingSeason = async (req, res, next) => {
  const seasonId = req.params.sid;

  let season;
  try {
    season = await Season.findById(seasonId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update season.",
      500
    );
    return next(error);
  }

  if (!season) {
    const error = new HttpError("Could not find season for this id.", 404);
    return next(error);
  }

  season.status = "ongoing";

  try {
    await season.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update season.",
      500
    );
    return next(error);
  }

  res.status(200).json({ season: season.toObject({ getters: true }) });
};

const updateToArchivedSeason = async (req, res, next) => {
  const seasonId = req.params.sid;

  let season;
  try {
    season = await Season.findById(seasonId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update season.",
      500
    );
    return next(error);
  }

  if (!season) {
    const error = new HttpError("Could not find season for this id.", 404);
    return next(error);
  }

  season.status = "archived";

  try {
    await season.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update season.",
      500
    );
    return next(error);
  }

  res.status(200).json({ season: season.toObject({ getters: true }) });
};

const removeTeamFromSeason = async (req, res, next) => {
  const seasonId = req.params.sid;
  const teamId = req.params.tid;

  let season;
  try {
    season = await Season.findById(seasonId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not remove team from season.",
      500
    );
    return next(error);
  }

  if (!season) {
    const error = new HttpError("Could not find season for this id.", 404);
    return next(error);
  }

  season.registeredTeams = season.registeredTeams.filter(
    (team) => team.toString() !== teamId
  );

  try {
    await season.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not remove team from season.",
      500
    );
    return next(error);
  }

  res.status(200).json({ season: season.toObject({ getters: true }) });
};

exports.getUpcomingSeasons = getUpcomingSeasons;
exports.getOngoingSeasons = getOngoingSeasons;
exports.getArchivedSeasons = getArchivedSeasons;
exports.createSeason = createSeason;
exports.getAllSeasons = getAllSeasons;
exports.deleteSeason = deleteSeason;
exports.getSeasonById = getSeasonById;
exports.updateSeasonDivisionTeams = updateSeasonDivisionTeams;
exports.updateToOngoingSeason = updateToOngoingSeason;
exports.updateToArchivedSeason = updateToArchivedSeason;
exports.removeTeamFromSeason = removeTeamFromSeason;
