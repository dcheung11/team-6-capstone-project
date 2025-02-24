const express = require("express");
const standingsController = require("../controllers/standings-controller");
const router = express.Router();

router.get("/:divisionId", standingsController.getStandingsByDivision);

module.exports = router;
