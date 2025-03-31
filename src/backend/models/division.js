// Author: Damien Cheung
// Description: Defines the Division model for MongoDB for season divisions
// Last Modified: 2025-03-31

const mongoose = require('mongoose');

// Define the schema for the Division model
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
