// Author: Emma Wigglesworth
// Description: Routes for player-related operations
// Last Modified: 2025-03-29

const express = require("express");
const { check } = require("express-validator");

const playersController = require("../controllers/players-controllers");

const router = express.Router();

router.get("/", playersController.getPlayers);

router.post(
  "/signup",
  [
    check("firstName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }), // revisit
  ],
  playersController.signup
);

router.post("/login", playersController.login);

router.get("/:pid", playersController.getPlayerById);

router.post("/acceptinvite", playersController.acceptInvite);

router.post("/sendinvite", playersController.sendInvite);

router.patch("/:pid", playersController.updatePlayerInfo);

module.exports = router;
