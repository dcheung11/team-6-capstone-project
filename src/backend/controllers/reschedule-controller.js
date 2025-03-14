const Game = require("../models/game");
const Team = require("../models/team");
const Notification = require("../models/notification");
const Gameslot = require("../models/gameslot");
const RescheduleRequest = require("../models/reschedule-request");

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD from ISO format
}

const createRequest = async (req, res) => {
  try {
    const { gameId, requestingTeamId, recipientTeamId, requestedGameslotIds } = req.body;

    // Find the game to be rescheduled
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Check if the new game slot is available
    // this shouldn't even happen since unavailable game slots
    // shouldn't even appear in reschedule menu
    for (const requestedGameslotId of requestedGameslotIds) {
      const isSlotAvailable = await Game.findOne({ gameslot: requestedGameslotId });
      console.log("isSlotAvailable: ", isSlotAvailable);
      if (isSlotAvailable !== null) {
        return res
        .status(400)
        .json({ message: "New game slot is not available" });
      }
    }

    // Find the recipient team
    const recipientTeam = await Team.findById(recipientTeamId);
    console.log("recipientTeam: ", recipientTeam);
    if (!recipientTeam) {
      return res.status(404).json({ message: "Other team not found" });
    }

    const newGameSlots = await Gameslot.find({ _id: { $in: requestedGameslotIds } });
    console.log("newGameSlot: ", newGameSlots);

    const requestingTeam = await Team.findById(requestingTeamId);
    console.log("requestingTeam: ", requestingTeam);    

    // create reschedule request
    const rescheduleRequest = new RescheduleRequest({
      gameId: gameId,
      requestingTeamId: requestingTeamId,
      recipientTeamId: recipientTeamId,
      requestedGameslotIds: requestedGameslotIds,
    });

    await rescheduleRequest.save();
    console.log("reschedule Request created: ", rescheduleRequest);

    // const date = formatDate(new Date(newGameSlot.date));
    // console.log("date: ", date);
    // const formattedDate = date.toLocaleString('en-US', { 
    //   timeZone: 'America/New_York', 
    //   month: 'short', 
    //   day: '2-digit', 
    //   year: 'numeric', 
    //   hour: '2-digit', 
    //   minute: '2-digit', 
    //   hour12: false 
    // });

    // Create a notification for the other team
    const notification = new Notification({
      type: "reschedule request",
      sender: requestingTeamId,
      recipient: recipientTeamId,
      message: `Team ${requestingTeam.name} has requested a reschedule`,
      rescheduleRequestId: rescheduleRequest._id,
    });

    await notification.save();
    console.log("notification: ", notification);

    // push notification to team.notifications array
    recipientTeam.notifications.push(notification._id);
    await recipientTeam.save();

    console.log("reschedule request sent successfully");

    res.status(200).json({ message: "Reschedule request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { rescheduleRequestId } = req.params;
    const { newSlot } = req.body;
    console.log("acceptRequest in reschedule-controller, rescheduleRequestId, newSlot: ", rescheduleRequestId, newSlot);

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
    // const requestedSlot = await Gameslot.findById(rescheduleRequest.requestedGameslotId);

    await Gameslot.updateOne({ _id: originalSlot._id }, { game: null });
    await Gameslot.updateOne({ _id: newSlot._id }, { game: game._id });
    game.date = newSlot.date;
    game.time = newSlot.time;
    game.field = newSlot.field;
    game.gameslot = newSlot._id;

    await game.save();

    // Create a notification for the requesting team
    const notification = new Notification({
      type: "update",
      sender: rescheduleRequest.recipientTeamId,
      recipient: rescheduleRequest.requestingTeamId,
      message: `Your reschedule request has been accepted.`,
    });

    await notification.save();

    console.log("reschedule request accepted successfully");
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
