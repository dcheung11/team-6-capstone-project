const express = require("express");
const gamesController = require("../controllers/games-controller");

const router = express.Router();

// Route to update game score
router.patch("/update-score/:gameId/:score1/:score2", gamesController.updateScore);

module.exports = router;
