const { validationResult } = require("express-validator");

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
  const { name, email, password } = req.body;

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

  const createdPlayer = new Player({
    name,
    email,
    password,
    waiverStatus: false,
    team: null,
  });

  try {
    await createdPlayer.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ player: createdPlayer.toObject({ getters: true }) });
};

exports.getPlayers = getPlayers;
exports.signup = signup;
