const mongoose = require('mongoose');

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
          type: Number,
          required: true,
          min: 1,
        },
        wins: {
            type: Number,
            required: true,
            min: 0
        },
        losses: {
            type: Number,
            required: true,
            min: 0
        },
        noshows: {
          type: Number,
          required: true,
          min: 0
        },
        draws: {
            type: Number,
            required: true,
            min: 0
        },
        rs: {
          type: Number,
          required: true,
          min: 0
        },
        ra: {
          type: Number,
          required: true,
          min: 0
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Standing', StandingSchema);
