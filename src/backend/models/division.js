const mongoose = require('mongoose');

const DivisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season', // Reference to Season model
      required: true,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team', // Reference to Team model
      },
    ],
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule', // Reference to Schedule model
    },
    standingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Standing', // Reference to Standing model
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Division', DivisionSchema);
