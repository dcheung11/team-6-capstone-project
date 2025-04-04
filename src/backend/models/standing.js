// Author: Emma Wigglesworth
// Description: Defines the Standing model for MongoDB for league standings
// Last Modified: 2025-03-14

const mongoose = require('mongoose');

// Define the schema for the Standing model
// Standing represents the rankings and statistics of teams within a division
// TODO - add a field for the seasonId
const StandingSchema = new mongoose.Schema(
  {
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division',
      required: true,
    },
    rankings: [
      {
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Team',
          required: true,
        },
        rank: {
          type: mongoose.Schema.Types.Mixed,
          default: "-",
        },
        p: {
          type: Number,
          required: true,
          min: 0,
        },
        w: {
          type: Number,
          required: true,
          min: 0,
        },
        l: {
          type: Number,
          required: true,
          min: 0,
        },
        d: {
          type: Number,
          required: true,
          min: 0,
        },
        rs: {
          type: Number,
          required: true,
          min: 0,
        },
        ra: {
          type: Number,
          required: true,
          min: 0,
        },
        differential: {
          type: Number,
          required: true, // no minimum here, allows negatives
        },
        dl: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Standing', StandingSchema);
