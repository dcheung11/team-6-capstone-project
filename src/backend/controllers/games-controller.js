const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Team = require("../models/team");
const Season = require("../models/season");
const Division = require("../models/division");
const Player = require("../models/player");
const Schedule = require("../models/schedule");
const Game = require("../models/game");

const updateScore = async (req, res, next) => {
  const { gameId, homeScore, awayScore } = req.params;

  try {
    const updatedGame = await Game.findByIdAndUpdate(
      gameId,
      {
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        submitted: true, // Set submitted to true
      },
      { new: true } // Returns the updated document
    );

    if (!updatedGame) {
      return next(new HttpError("Game not found", 404));
    }

    console.log("Updated game:", updatedGame);
    res.json({ message: "Score updated successfully", game: updatedGame });
  } catch (err) {
    console.error("Error updating score:", err);
    return next(new HttpError("Failed to update score", 500));
  }
};

exports.updateScore = updateScore;
