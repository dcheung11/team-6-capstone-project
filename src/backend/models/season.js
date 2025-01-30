const mongoose = require("mongoose");

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
      schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule", // Reference to Schedule model
      }
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Season", SeasonSchema);
