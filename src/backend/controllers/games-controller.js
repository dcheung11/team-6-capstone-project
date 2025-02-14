const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Team = require("../models/team");
const Season = require("../models/season");
const Division = require("../models/division");
const Player = require("../models/player");
const Schedule = require("../models/schedule");
const Game = require("../models/game");

const updateScore = async (req, res, next) => {
  const { gameId, score1, score2 } = req.params; // Game ID
  try {
    await Game.findByIdAndUpdate(gameId, { score1: score1, score2: score2 });
  } catch (err) {
    const error = new HttpError("Failed to update score", 500);
    return next(error);
  }
};

exports.updateScore = updateScore;
