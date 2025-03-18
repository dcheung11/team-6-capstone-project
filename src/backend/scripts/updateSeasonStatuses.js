const mongoose = require("mongoose");
const Season = require("../models/season");
require("dotenv").config(); // Load DB credentials from .env

async function updateSeasonStatuses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const now = new Date();

    // Update seasons from "upcoming" to "ongoing"
    const ongoingUpdate = await Season.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now }, status: "upcoming" },
      { $set: { status: "ongoing" } }
    );
    console.log(`Updated ${ongoingUpdate.modifiedCount} seasons to 'ongoing'.`);

    // Archive seasons that have ended
    const archiveUpdate = await Season.updateMany(
      { endDate: { $lt: now }, status: "ongoing" },
      { $set: { status: "archived" } }
    );
    console.log(`Archived ${archiveUpdate.modifiedCount} seasons.`);

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
