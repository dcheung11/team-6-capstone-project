const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema(
  {
    season: { 
      type: Schema.Types.ObjectId,
      ref: 'Season',
      required: true,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: 'Division',
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
