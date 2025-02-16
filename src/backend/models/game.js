const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  field: { type: String, required: true },
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  homeScore: { type: Number, default: null },
  awayScore: { type: Number, default: null },
  gameslot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gameslot",
    required: true,
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Division",
    required: true,
  },
});

module.exports = mongoose.model("Game", GameSchema);
