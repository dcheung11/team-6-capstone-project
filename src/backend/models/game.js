const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  field: { type: String, required: true },
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  homeScore: { type: Number, default: null },
  awayScore: { type: Number, default: null },
  defaultLossTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null }, // store who lost by default, if any
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
  submitted: { type: Boolean, default: false }, // Added submitted field
});

module.exports = mongoose.model("Game", GameSchema);
