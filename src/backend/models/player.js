const mongoose = require("mongoose");

// Define the schema for the Player model
// The Player model represents a player in the league, or a commissioner account
// It includes personal information such as first name, last name, email, password, and phone number
// It also includes the player's team, role, and waiver status
// Commissioner roles have to be made manually at the moment
const PlayerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, default: "" }, // Added phone number
  gender: { type: String, enum: ["male", "female", "other"], default: "other" }, // Added gender
  waiverStatus: { type: Boolean, default: false },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  role: { type: String, enum: ["player", "commissioner"], default: "player" },
  invites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
});

module.exports = mongoose.model("Player", PlayerSchema);
