// Author: Jad Haytaoglu
// Description: Defines the Gameslot model for MongoDB for game time slots for scheduling
// Last Modified: 2025-03-31

const mongoose = require("mongoose");

// Define the schema for the GameSlot model
// GameSlot represents a time slot for a game on a specific date and field
const GameSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: false, // A slot may or may not have a game
  },
});

GameSlotSchema.index({ date: 1, time: 1, field: 1 }, { unique: true });

module.exports = mongoose.model("GameSlot", GameSlotSchema);
