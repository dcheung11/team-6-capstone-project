const Game = require("../models/game");
const Team = require("../models/team");
const Notification = require("../models/notification");
const Gameslot = require("../models/gameslot");
const RescheduleRequest = require("../models/reschedule-request");

const createRequest = async (req, res) => {
  try {
    const { gameId, requestingTeamId, recipientTeamId, requestedGameslotId } = req.body;

    // Find the game to be rescheduled
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Check if the new game slot is available
    // this shouldn't even happen since unavailable game slots
    // shouldn't even appear in reschedule menu
    const isSlotAvailable = await Game.findOne({ gameslot: requestedGameslotId });
    console.log("isSlotAvailable: ", isSlotAvailable);
    if (isSlotAvailable !== null) {
      return res
      .status(400)
      .json({ message: "New game slot is not available" });
    }

    // Find the recipient team
    const recipientTeam = await Team.findById(recipientTeamId);
    console.log("recipientTeam: ", recipientTeam);
    if (!recipientTeam) {
      return res.status(404).json({ message: "Other team not found" });
    }

    const newGameSlot = await Gameslot.findById(requestedGameslotId);
    const requestingTeam = await Team.findById(requestingTeamId);

    // create reschedule request
    const rescheduleRequest = new RescheduleRequest({
      gameId: gameId,
      requestingTeamId: requestingTeamId,
      recipientTeamId: recipientTeamId,
      requestedGameslotId: requestedGameslotId,
    });

    await rescheduleRequest.save();

    const date = new Date(newGameSlot.date);
    const formattedDate = date.toLocaleString('en-US', { 
      timeZone: 'America/New_York', 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    // Create a notification for the other team
    const notification = new Notification({
      type: "reschedule request",
      sender: requestingTeamId,
      recipient: recipientTeamId,
      message: `Team ${requestingTeam.name} has requested to reschedule the game to ${formattedDate}. On ${newGameSlot.field}. Please approve or reject the request.`,
    });

    await notification.save();

    res.status(200).json({ message: "Reschedule request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { rescheduleRequestId } = req.params;

    // Find the reschedule request
    const rescheduleRequest = await RescheduleRequest.findById(rescheduleRequestId);

    if (!rescheduleRequest) {
      return res.status(404).json({ message: "Reschedule request not found" });
    }

    // Update the status of the reschedule request to accepted
    await RescheduleRequest.updateOne({ _id: rescheduleRequestId }, { status: "Accepted" });

    // Update the game slots and game
    const game = await Game.findById(rescheduleRequest.gameId);
    const originalSlot = await Gameslot.findById(game.gameslot);
    const requestedSlot = await Gameslot.findById(rescheduleRequest.requestedGameslotId);

    await Gameslot.updateOne({ _id: originalSlot._id }, { game: null });
    await Gameslot.updateOne({ _id: requestedSlot._id }, { game: game._id });
    game.date = requestedSlot.date;
    game.time = requestedSlot.time;
    game.field = requestedSlot.field;
    game.gameslot = requestedSlot._id;

    await game.save();

    // Create a notification for the requesting team
    const notification = new Notification({
      type: "update",
      sender: rescheduleRequest.recipientTeamId,
      recipient: rescheduleRequest.requestingTeamId,
      message: `Your reschedule request has been accepted.`,
    });

    await notification.save();

    res.status(200).json({ message: "Reschedule request accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const declineRequest = async (req, res) => {
  try {
    const { rescheduleRequestId } = req.params;

    // Find the reschedule request
    const rescheduleRequest = await RescheduleRequest.findById(rescheduleRequestId);
    if (!rescheduleRequest) {
      return res.status(404).json({ message: "Reschedule request not found" });
    }

    // Update the status of the reschedule request to declined
    try {
      await RescheduleRequest.updateOne({ _id: rescheduleRequestId }, { status: "Declined" });
    } catch (error) {
      console.error("Error saving reschedule request while declining: ", error);
      return res.status(500).json({ message: "Error saving reschedule request", error });
    }

    // Create a notification for the requesting team
    const notification = new Notification({
      type: "update",
      sender: rescheduleRequest.recipientTeamId,
      recipient: rescheduleRequest.requestingTeamId,
      message: `Your reschedule request has been declined.`,
    });

    await notification.save();
    
    res.status(200).json({ message: "Reschedule request declined successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAvailableGameslots = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Find all gameslots that do not have a game attached to them and are in the current year
    const availableGameslots = await Gameslot.find({
      game: null,
      date: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1)
      }
    }).populate();
    
    res.status(200).json(availableGameslots);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteRequest = async (req, res) => {
    try {
      const { rescheduleRequestId } = req.params;

      // Find the reschedule request
      const rescheduleRequest = await RescheduleRequest.findById(rescheduleRequestId);
      if (!rescheduleRequest) {
        return res.status(404).json({ message: "Reschedule request not found" });
      }

      // Delete the reschedule request
      await RescheduleRequest.deleteOne({ _id: rescheduleRequestId });

      res.status(200).json({ message: "Reschedule request deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};

const getRequestById = async (req, res) => {
    try {
        const { rescheduleRequestId } = req.params;

        // Find the reschedule request
        const rescheduleRequest = await RescheduleRequest.findById(rescheduleRequestId);
        if (!rescheduleRequest) {
          return res.status(404).json({ message: "Reschedule request not found" });
        }

        res.status(200).json(rescheduleRequest);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getAllRequests = async (req, res) => {
    try {
        // Get all reschedule requests
        const rescheduleRequests = await RescheduleRequest.find();

        res.status(200).json(rescheduleRequests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    createRequest,
    deleteRequest,
    getRequestById,
    getAllRequests,
    acceptRequest,
    declineRequest,
    getAvailableGameslots
};
