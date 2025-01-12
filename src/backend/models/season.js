const mongoose = require('mongoose');

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
    divisions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Division', // Reference to Division model
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Season', SeasonSchema);
