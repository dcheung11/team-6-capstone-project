const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the RescheduleRequest model
// This model represents a request to another captain player to reschedule a game
const RescheduleRequestSchema = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    requestingTeamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    recipientTeamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    requestedGameslotIds: [{
      type: Schema.Types.ObjectId,
      ref: 'GameSlot',
      required: true,
    }],
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RescheduleRequest', RescheduleRequestSchema);
