const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error"); // Adjust the path as necessary
const Announcement = require("../models/announcements"); // Adjust the path as necessary

const createAnnouncement = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, content } = req.body;

  const createdAnnouncement = new Announcement({
    title,
    content,
  });

  try {
    await createdAnnouncement.save();
  } catch (err) {
    const error = new HttpError(
      "Creating announcement failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ announcement: createdAnnouncement });
};

const editAnnouncement = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { aid } = req.params;
  const { title, content } = req.body;

  let announcement;
  try {
    announcement = await Announcement.findById(aid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find announcement.",
      500
    );
    return next(error);
  }

  if (!announcement) {
    return next(
      new HttpError("Could not find announcement for the provided ID.", 404)
    );
  }

  announcement.title = title;
  announcement.content = content;

  try {
    await announcement.save();
  } catch (err) {
    const error = new HttpError(
      "Updating announcement failed, please try again.",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ announcement: announcement.toObject({ getters: true }) });
};

const getAnnouncements = async (req, res, next) => {
  let announcements;
  try {
    announcements = await Announcement.find().sort({ createdAt: -1 });
  } catch (err) {
    const error = new HttpError(
      "Fetching announcements failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    announcements: announcements.map((announcement) =>
      announcement.toObject({ getters: true })
    ),
  });
};

const getAnnouncementById = async (req, res, next) => {
  const { aid } = req.params;
  let announcement;
  try {
    announcement = await Announcement.findById(aid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find announcement.",
      500
    );
    return next(error);
  }

  if (!announcement) {
    return next(
      new HttpError("Could not find announcement for the provided ID.", 404)
    );
  }

  res.json({ announcement: announcement.toObject({ getters: true }) });
};

const deleteAnnouncement = async (req, res, next) => {
  const { aid } = req.params;

  let announcement;
  try {
    announcement = await Announcement.findById(aid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete announcement.",
      500
    );
    return next(error);
  }

  if (!announcement) {
    return next(
      new HttpError("Could not find announcement for the provided ID.", 404)
    );
  }

  try {
    await announcement.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete announcement.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Announcement deleted." });
};

module.exports = {
  createAnnouncement,
  editAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  deleteAnnouncement,
};
