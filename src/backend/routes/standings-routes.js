// Author: Damien Cheung
// Description: Routes for division-related operations
// Last Modified: 2025-03-16

const express = require("express");
const standingsController = require("../controllers/standings-controller");
const router = express.Router();

router.get("/:divisionId", standingsController.getStandingsByDivision);

module.exports = router;
