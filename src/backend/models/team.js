const mongoose = require("mongoose");

// Define the schema for the Team model
// The Team model represents a team in the league and includes information about the team name, division, roster, captain, season, and statistics
// It also includes a list of notifications, preferred times for games, and blacklisted days
const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  divisionId: { type: mongoose.Schema.Types.ObjectId, ref: "Division", required: true },
  roster: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  captainId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  seasonId : { type: mongoose.Schema.Types.ObjectId, ref: "Season", required: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
  preferredTimes: {
    type: String,
    enum: ["Mostly Early", "Balanced", "Mostly Late"],
    default: "Balanced",
  },
  blacklistDays: [
    {
      type: String,
      enum: ["None", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      required: false,
    },
  ],
  
});

module.exports = mongoose.model("Team", TeamSchema);
