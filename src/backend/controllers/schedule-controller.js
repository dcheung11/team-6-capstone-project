const Schedule = require("../models/Schedule");
const { generateSchedule } = require("../schedule-algorithm");

const generate = async (req, res) => {
    try {
        const { season, division, teams, fields, timeSlots, days, teamPreferences, numGames } = req.body;
        
        // Generate schedule using algorithm
        const generatedGames = generateSchedule(teams, fields, timeSlots, days, teamPreferences, numGames);
        
        // Create new schedule entry
        const newSchedule = new Schedule({
            season,
            division,
            games: generatedGames, // Assuming 'generatedGames' contains valid game objects
        });

        await newSchedule.save();
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error("Error generating schedule:", error);
        res.status(500).json({ error: "Failed to generate schedule" });
    }
};

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate("games division season");
        res.json(schedules);
    } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).json({ error: "Failed to fetch schedules" });
    }
};

const getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).populate("games division season");
        if (!schedule) return res.status(404).json({ error: "Schedule not found" });
        res.json(schedule);
    } catch (error) {
        console.error("Error fetching schedule:", error);
        res.status(500).json({ error: "Failed to fetch schedule" });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!schedule) return res.status(404).json({ error: "Schedule not found" });
        res.json({ message: "Schedule deleted successfully" });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        res.status(500).json({ error: "Failed to delete schedule" });
    }
};

module.exports = {
    generate,
    getAllSchedules,
    getScheduleById,
    deleteSchedule
};
