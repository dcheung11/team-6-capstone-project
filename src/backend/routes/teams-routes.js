const express = require("express");
const { check } = require("express-validator");

const teamsController = require("../controllers/teams-controllers");

const router = express.Router();

router.get("/", teamsController.getTeams);

router.post(
  "/registerTeam",
  [
    check("name").not().isEmpty(),
    check("division").not().isEmpty(),
    check("captain").not().isEmpty(),
    check("roster").isArray({ min: 1 }), // array is not empty
  ],
  teamsController.registerTeam
);

// router.post("/login", playersController.login);

module.exports = router;
