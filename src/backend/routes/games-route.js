// Author: Damien Cheung
// Description: Routes for game-related operations
// Last Modified: 2025-02-01

const express = require("express");
const gamesController = require("../controllers/games-controller");

const router = express.Router();

// Route to update game score
router.patch("/update-score/:gameId/:homeScore/:awayScore", gamesController.updateScore);

module.exports = router;
