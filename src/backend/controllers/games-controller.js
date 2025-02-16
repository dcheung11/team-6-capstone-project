const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Team = require("../models/team");
const Season = require("../models/season");
const Division = require("../models/division");
const Player = require("../models/player");
const Schedule = require("../models/schedule");
const Game = require("../models/game");

const updateScore = async (req, res, next) => {
  const { gameId, homeScore, awayScore } = req.params; // Game ID
  try {
    await Game.findByIdAndUpdate(gameId, { homeScore, awayScore });
  } catch (err) {
    const error = new HttpError("Failed to update score", 500);
    return next(error);
  }
};

exports.updateScore = updateScore;
