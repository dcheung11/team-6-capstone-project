const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const Player = require("../models/player");

const getPlayers = async (req, res, next) => {
  let players;
  try {
    players = await Player.find(); // todo: remove password for privacy
  } catch (err) {
    const error = new HttpError(
      "Fetching players failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    players: players.map((player) => player.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { firstName, lastName, email, password, role } = req.body;

  let existingPlayer;
  try {
    existingPlayer = await Player.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingPlayer) {
    const error = new HttpError(
      "Player exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create player, please try again.",
      500
    );
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
    token = jwt.sign(
      { playerId: createdPlayer.id, email: createdPlayer.email },
      "SECRET",
      { expiresIn: "2h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
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
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingPlayer) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingPlayer.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { playerId: existingPlayer.id, email: existingPlayer.email },
      "SECRET",
      { expiresIn: "2h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    playerId: existingPlayer.id,
    email: existingPlayer.email,
    token: token,
  });
};

const getPlayerById = async (req, res, next) => {
  const playerId = req.params.pid;

  let player;
  try {
    player = await Player.findById(playerId).populate({
      path: "team",
      populate: [
        { path: "roster" }, // Populate roster with player details
        { path: "captainId" }, // Populate captain details
        { path: "divisionId" }, // Populate division details
        { path: "seasonId" }, // Populate season details
      ],
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching player failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!player) {
    const error = new HttpError(
      "Could not find a player for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ player: player.toObject({ getters: true }) });
};

exports.getPlayers = getPlayers;
exports.signup = signup;
exports.login = login;
exports.getPlayerById = getPlayerById;
