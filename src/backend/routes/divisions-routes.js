const express = require("express");
const { check } = require("express-validator");

const divisionsControllers = require("../controllers/divisions-controllers");

const router = express.Router();

router.post(
  "/create",
  [
    check("seasonId").not().isEmpty(),
    check("name").not().isEmpty(),
    check("teams").isArray(),
  ],
  divisionsControllers.createDivision
);

router.get("/:id", divisionsControllers.getDivisionById);

router.patch(
  "/:id/teams",
  [check("divisionId").not().isEmpty(), check("teams").isArray()],
  divisionsControllers.updateDivisionTeams
);

module.exports = router;
