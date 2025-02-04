const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  division: { type: String, required: true },
  // preferredTimes,
  roster: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  captain: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
});

module.exports = mongoose.model("Team", TeamSchema);
