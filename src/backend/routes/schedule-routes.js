const express = require("express");
const {
    generateScheduleController,
    getAllSchedules,
    getScheduleById,
    deleteSchedule
} = require("../controllers/schedule-controller");

const router = express.Router();

router.post("/generate", generateScheduleController);

router.get("/schedules", getAllSchedules);

router.get("/:id", getScheduleById);

router.delete("/:id", deleteSchedule);

module.exports = router;
