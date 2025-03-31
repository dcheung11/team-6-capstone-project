// Author: Damien Cheung
// Description: Defines the Season model for MongoDB for league seasons
// Last Modified: 2025-02-14

const mongoose = require("mongoose");

// Define the schema for the Season model
// Season represents a specific period of time in which a league or tournament takes place
// It contains information about the season's name, start and end dates, divisions, teams, and schedule
// The schema also includes a status field to indicate the current state of the season (upcoming, ongoing, archived)
// The registeredTeams field is an array of unique team IDs that are registered for the season
const SeasonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes extra spaces
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    allowedDivisions: {
      type: Number,
      default: 4,
    },
    divisions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Division", // Reference to Division model
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "archived"],
      default: "upcoming",
    },
    registeredTeams: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team", // Reference to Team model
        },
      ],
      validate: {
        validator: function (teams) {
          // Ensure all elements in the array are unique
          return (
            teams.length === new Set(teams.map((id) => id.toString())).size
          );
        },
        message: "Teams must be unique.",
      },
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule", // Reference to Schedule model
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Season", SeasonSchema);
