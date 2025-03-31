// Author: Damien Cheung
// Description: Routes for schedule-related operations
// Last Modified: 2025-02-06

const express = require("express");
const {
  generateSchedule,
  getAllSchedules,
  getScheduleById,
  deleteSchedule,
  getScheduleBySeasonId,
} = require("../controllers/schedule-controller");

const router = express.Router();

router.post("/generate", generateSchedule);

router.get("/all", getAllSchedules);
router.get("/:id", getScheduleById);
router.get("/season/:sid", getScheduleBySeasonId);

router.delete("/:id", deleteSchedule);

module.exports = router;
