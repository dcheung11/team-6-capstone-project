const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  waiverStatus: { type: Boolean, default: false },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  role: { type: String, default: 'player' },
});

module.exports = mongoose.model('Player', PlayerSchema);
