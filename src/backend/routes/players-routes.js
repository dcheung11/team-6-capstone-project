const express = require("express");
const { check } = require("express-validator");

const playersController = require("../controllers/players-controllers");

const router = express.Router();

router.get("/", playersController.getPlayers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }), // revisit
  ],
  playersController.signup
);

module.exports = router;
