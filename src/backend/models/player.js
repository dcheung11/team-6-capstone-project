const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  waiverStatus: { type: Boolean, default: false },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
});

module.exports = mongoose.model('Player', PlayerSchema);
