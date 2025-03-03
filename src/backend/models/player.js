const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, default: "" }, // Added phone number
  gender: { type: String, enum: ["male", "female", "other"], default: "other" }, // Added gender
  waiverStatus: { type: Boolean, default: false },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  role: { type: String, default: "player" },
  invites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
});

module.exports = mongoose.model("Player", PlayerSchema);
