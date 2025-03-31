// Author: Damien Cheung
// Description: Player-related CRUD operations, including signup, login, and invite acceptance
// Last Modified: 2025-03-31

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const Player = require("../models/player");
const Team = require("../models/team");
const mongoose = require("mongoose");

const getPlayers = async (req, res, next) => {
  let players;
  try {
    players = await Player.find().populate("team"); // todo: remove password for privacy
  } catch (err) {
    const error = new HttpError("Fetching players failed, please try again later.", 500);
    return next(error);
  }
  res.json({
    players: players.map((player) => player.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }
  const { firstName, lastName, email, password, role } = req.body;

  let existingPlayer;
  try {
    existingPlayer = await Player.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }

  if (existingPlayer) {
    const error = new HttpError("Player exists already, please login instead.", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create player, please try again.", 500);
    return next(error);
  }

  const createdPlayer = new Player({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    waiverStatus: false,
    team: null,
    role: role || "player",
  });

  try {
    await createdPlayer.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ playerId: createdPlayer.id, email: createdPlayer.email }, "SECRET", { expiresIn: "2h" });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }

  res.status(201).json({
    playerId: createdPlayer.id,
    email: createdPlayer.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingPlayer;

  try {
    existingPlayer = await Player.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again later.", 500);
    return next(error);
  }

  if (!existingPlayer) {
    const error = new HttpError("Invalid credentials, could not log you in.", 403);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingPlayer.password);
  } catch (err) {
    const error = new HttpError("Could not log you in, please check your credentials and try again.", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, could not log you in.", 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ playerId: existingPlayer.id, email: existingPlayer.email }, "SECRET", { expiresIn: "2h" });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again later.", 500);
    return next(error);
  }

  res.json({
    playerId: existingPlayer.id,
    email: existingPlayer.email,
    token: token,
    role: existingPlayer.role,
  });
};

const getPlayerById = async (req, res, next) => {
  const playerId = req.params.pid;

  let player;
  try {
    player = await Player.findById(playerId)
      .populate({
        path: "team",
        populate: [
          { path: "roster" }, // Populate roster with player details
          { path: "captainId" }, // Populate captain details
          { path: "divisionId" }, // Populate division details
          { path: "seasonId" }, // Populate season details
        ],
      })
      .populate({
        path: "invites",
        populate: [{ path: "divisionId" }, { path: "captainId" }],
      });
  } catch (err) {
    const error = new HttpError("Fetching player failed, please try again later.", 500);
    return next(error);
  }

  if (!player) {
    const error = new HttpError("Could not find a player for the provided id.", 404);
    return next(error);
  }

  res.json({ player: player.toObject({ getters: true }) });
};

const acceptInvite = async (req, res, next) => {
  const { teamId, playerId } = req.body; // Team ID and Player ID

  let player, team;
  try {
    // Find the player by ID
    player = await Player.findById(playerId);
    if (!player) {
      const error = new HttpError("Could not find a player for the provided id.", 404);
      return next(error);
    }

    // Find the team by ID
    team = await Team.findById(teamId); // Assuming you have a Team model
    if (!team) {
      const error = new HttpError("Could not find the team for the provided id.", 404);
      return next(error);
    }

    // Assign the team to the player
    player.team = team._id; // Set the player's team to the selected team

    player.invites.pull(team._id); // This will remove the team ID from the player's invites array

    // Save the updated player document
    await player.save();

    // Optionally, add the player to the team's roster
    team.roster.push(player._id);
    await team.save();
  } catch (err) {
    const error = new HttpError("Accepting the invite failed, please try again later.", 500);
    return next(error);
  }

  // Return the updated player and team information
  res.json({
    message: "Invite accepted successfully!",
    player: player.toObject({ getters: true }),
  });
};

const sendInvite = async (req, res, next) => {
  const { teamId, playerId } = req.body; // Team ID and Player ID

  let player, team;
  try {
    // Find the player by ID
    player = await Player.findById(playerId);
    if (!player) {
      const error = new HttpError("Could not find a player for the provided id.", 404);
      return next(error);
    }

    // // Check if the player already has a team
    // if (player.team) {
    //   const error = new HttpError("Player is already part of a team.", 400);
    //   return next(error);
    // }

    // Find the team by ID
    team = await Team.findById(teamId);
    if (!team) {
      const error = new HttpError("Could not find the team for the provided id.", 404);
      return next(error);
    }

    player.invites.push(team._id); // Add the team ID to the player's invites array
    await player.save(); // Save the player document
  } catch (err) {
    const error = new HttpError("Inviting the player failed, please try again later.", 500);
    return next(error);
  }

  // Send response confirming the invite was successfully sent
  res.json({
    message: "Player invited successfully!",
    player: player.toObject({ getters: true }),
  });
};

const updatePlayerInfo = async (req, res, next) => {
  const { pid } = req.params;
  const updates = req.body;

  try {
    // Convert pid to ObjectId
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return next(new HttpError("Invalid player ID.", 400));
    }

    const player = await Player.findById(pid);
    if (!player) {
      return next(new HttpError("Player not found.", 404));
    }

    Object.keys(updates).forEach((key) => {
      player[key] = updates[key]; // Apply updates dynamically
    });

    await player.save();

    res.status(200).json({ message: "Player updated successfully", player });
  } catch (err) {
    return next(new HttpError("Updating player failed, please try again.", 500));
  }
};


exports.getPlayers = getPlayers;
exports.signup = signup;
exports.login = login;
exports.getPlayerById = getPlayerById;
exports.acceptInvite = acceptInvite;
exports.sendInvite = sendInvite;
exports.updatePlayerInfo = updatePlayerInfo;
