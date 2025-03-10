const express = require("express");
const { check } = require("express-validator");

const seasonController = require("../controllers/season-controllers");

const router = express.Router();

router.get("/", seasonController.getAllSeasons);

router.get("/upcoming", seasonController.getUpcomingSeasons);

router.get("/ongoing", seasonController.getOngoingSeasons);

router.get("/archived", seasonController.getArchivedSeasons);

router.post(
  "/create",
  [
    check("name").not().isEmpty(),
    check("startDate").isDate(),
    check("endDate").isDate(),
    check("startDate").custom((value, { req }) => {
      if (new Date(value) >= new Date(req.body.endDate)) {
        throw new Error("Start date must be before end date");
      }
      return true;
    }),
    check("allowedDivisions").isNumeric(),
  ],
  seasonController.createSeason
);

router.delete("/:sid", seasonController.deleteSeason);

router.get("/:sid", seasonController.getSeasonById);

router.patch("/:sid/divisionTeams", seasonController.updateSeasonDivisionTeams);

router.patch("/:sid/launch", seasonController.updateToOngoingSeason);

router.patch("/:sid/removeTeam/:tid", seasonController.removeTeamFromSeason);

module.exports = router;
