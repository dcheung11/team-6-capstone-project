// Author: Damien Cheung
// Description: Script to auto-update the status of seasons in the database using a cron job
// Last Modified: 2025-03-20

const mongoose = require("mongoose");
const Season = require("../models/season");
require("dotenv").config(); // Load DB credentials from .env

// This script updates the status of seasons in the database.
// It checks the current date and updates the status of seasons accordingly:
// - If the current date is between the start and end dates of a season, it sets the status from "upcoming" to "ongoing".
// - If the current date is past the end date of a season, it sets the status to "archived".
async function updateSeasonStatuses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const now = new Date();

    // Update seasons from "upcoming" to "ongoing". Variable stored in case of testing needs
    const ongoingUpdate = await Season.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now }, status: "upcoming" },
      { $set: { status: "ongoing" } }
    );

    // Archive seasons that have ended
    const archiveUpdate = await Season.updateMany(
      { endDate: { $lt: now }, status: "ongoing" },
      { $set: { status: "archived" } }
    );

    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating seasons:", error);
    mongoose.connection.close();
  }
}

// Run script if executed directly
if (require.main === module) {
  updateSeasonStatuses();
}

module.exports = updateSeasonStatuses;
