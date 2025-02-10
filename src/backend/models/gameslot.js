const mongoose = require('mongoose');

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
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: false, // A slot may or may not have a game
  },
});

module.exports = mongoose.model('GameSlot', GameSlotSchema);
