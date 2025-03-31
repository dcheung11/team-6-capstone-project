const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Schedule model
// Schedule represents a collection of game slots and games for a specific season
// It contains references to the season, game slots, and games
const ScheduleSchema = new Schema(
  {
    seasonId: { 
      type: Schema.Types.ObjectId,
      ref: 'Season',
      required: true,
    },
    gameSlots: [ 
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GameSlot'
      },
    ],
    games: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Game',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Schedule', ScheduleSchema);
