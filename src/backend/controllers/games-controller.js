// Author: Damien Cheung
// Description: Game-related operations (updating scores)
// Last Modified: 2025-03-31

const HttpError = require("../models/http-error");
const Game = require("../models/game");
const { updateStandings } = require("./standings-controller")

const updateScore = async (req, res, next) => {
  const { gameId, homeScore, awayScore } = req.params;
  const { defaultLossTeam } = req.body;

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
