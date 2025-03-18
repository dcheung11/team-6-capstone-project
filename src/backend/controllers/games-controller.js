const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Team = require("../models/team");
const Season = require("../models/season");
const Division = require("../models/division");
const Player = require("../models/player");
const Schedule = require("../models/schedule");
const Game = require("../models/game");
const { updateStandings } = require("./standings-controller")

const updateScore = async (req, res, next) => {
  const { gameId, homeScore, awayScore } = req.params;
  const { defaultLossTeam } = req.body;

  console.log("Received data:", { gameId, homeScore, awayScore, defaultLossTeam }); // Debugging
  console.log("Full req.body:", req.body);
  console.log("Extracted defaultLossTeam:", req.body.defaultLossTeam);


  try {
    const updatedGame = await Game.findByIdAndUpdate(
      gameId,
      {
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        defaultLossTeam: defaultLossTeam,
        submitted: true, // Set submitted to true
      },
      { new: true } // Returns the updated document
    );

    if (!updatedGame) {
      return next(new HttpError("Game not found", 404));
    }

    // STANDINGS: updated score triggers update standings for the division
    try {
      await updateStandings(updatedGame.division);
      
    } catch (err) {
      console.error("Error updating standings:", err);
      return next(new HttpError("Failed to update standings", 500))
    }
    
    res.json({ message: "Score updated successfully", game: updatedGame });

  } catch (err) {
    console.error("Error updating score:", err);
    return next(new HttpError("Failed to update score", 500));
  }
};

exports.updateScore = updateScore;
