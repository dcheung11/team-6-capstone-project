const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RescheduleRequestSchema = new Schema(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    requestingTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    recipientTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    requestedGameslot: {
      type: Schema.Types.ObjectId,
      ref: 'GameSlot',
      required: true,
    },
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
