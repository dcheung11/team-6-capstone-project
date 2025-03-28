const express = require("express");
const { check } = require("express-validator");

const teamsController = require("../controllers/teams-controllers");

const router = express.Router();

router.get("/", teamsController.getTeams);

router.post(
  "/registerTeam",
  [
    check("name").not().isEmpty(),
    check("divisionId").not().isEmpty(),
    check("captainId").not().isEmpty(),
    check("roster").isArray({ min: 1 }), // array is not empty
    check("seasonId").not().isEmpty(),
  ],
  teamsController.registerTeam
);

router.get("/:id", teamsController.getTeamsById);

router.get("/schedule/:id", teamsController.getScheduleGamesByTeamId);

router.delete("/:teamId/roster/:playerId", teamsController.removePlayerFromRoster);

module.exports = router;
