const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  divisionId: { type: mongoose.Schema.Types.ObjectId, ref: "Division", required: true },
  roster: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  captainId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  season : { type: mongoose.Schema.Types.ObjectId, ref: "Season", required: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  preferredTimes: {
    type: String,
    enum: ["Mostly Early", "Balanced", "Mostly Late"],
    default: "Balanced",
  },
  blacklistDays: [
    {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      required: false,
    },
  ],
  
});

module.exports = mongoose.model("Team", TeamSchema);
