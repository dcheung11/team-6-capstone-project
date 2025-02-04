const express = require("express");
const {
    generateSchedule,
    getAllSchedules,
    getScheduleById,
    deleteSchedule
} = require("../controllers/schedule-controller");

const router = express.Router();

router.post("/generate", generateSchedule);

router.get("/all", getAllSchedules);
router.get("/:id", getScheduleById);

router.delete("/:id", deleteSchedule);

module.exports = router;
