const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RescheduleRequestSchema = new Schema(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    requestedTimeSlot: {
      type: Schema.Types.ObjectId,
      ref: 'GameSlot',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    requestDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RescheduleRequest', RescheduleRequestSchema);
