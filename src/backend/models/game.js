const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  field: { type: String, required: true },
  team1: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  team2: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  score1: { type: Number, default: 0 },
  score2: { type: Number, default: 0 },
  gameslot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gameslot",
    required: true,
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  }
});

module.exports = mongoose.model("Game", GameSchema);
