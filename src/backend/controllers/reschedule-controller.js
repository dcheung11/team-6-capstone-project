const Game = require("../models/game");
const Team = require("../models/team");
const Notification = require("../models/notification");
const Gameslot = require("../models/gameslot");
const RescheduleRequest = require("../models/reschedule-request");

const createRequest = async (req, res) => {
  try {
    const { gameId, newGameSlotId, requestingTeamId } = req.body;

    // Find the game to be rescheduled
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Check if the new game slot is available
    // this shouldn't even happen since unavailable game slots
    // shouldn't even appear in reschedule menu
    const isSlotAvailable = await Game.findOne({ gameslot: newGameSlotId });
    if (isSlotAvailable) {
      return res
        .status(400)
        .json({ message: "New game slot is not available" });
    }

    // Find the recipient team
    const otherTeamId = game.teams.find(
      (teamId) => teamId !== requestingTeamId
    );
    const otherTeam = await Team.findById(otherTeamId);
    if (!otherTeam) {
      return res.status(404).json({ message: "Other team not found" });
    }

    const newGameSlot = Gameslot.findById(newGameSlotId);
    const requestingTeam = Team.findById(requestingTeamId);

    // create reschedule request
    const rescheduleRequest = new RescheduleRequest({
      game: gameId,
      requestingTeam: requestingTeamId,
      recipientTeam: otherTeamId,
      requestedGameslot: newGameSlotId,
    });

    await rescheduleRequest.save();

    // Create a notification for the other team
    const notification = new Notification({
      type: "reschedule request",
      sender: requestingTeamId,
      recipient: otherTeamId,
      message: `Team ${requestingTeam.name} has requested to reschedule the game to ${newGameSlot.date}. Please approve or reject the request.`,
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
    rescheduleRequest.status = "Accepted";
    await rescheduleRequest.save();
    

    // Update the game slots and game
    const game = await Game.findById(rescheduleRequest.game);
    const originalSlot = await Gameslot.findById(game.gameslot);
    const requestedSlot = await Gameslot.findById(rescheduleRequest.requestedGameslot);

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
      sender: rescheduleRequest.recipientTeam,
      recipient: rescheduleRequest.requestingTeam,
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
    rescheduleRequest.status = "Declined";
    try {
      await rescheduleRequest.save();
      
    } catch (error) {
      console.error("Error saving reschedule request while declining: ", error);
      return res.status(500).json({ message: "Error saving reschedule request", error });
    }

    // Create a notification for the requesting team
    const notification = new Notification({
      type: "update",
      sender: rescheduleRequest.recipientTeam,
      recipient: rescheduleRequest.requestingTeam,
      message: `Your reschedule request has been declined.`,
    });

    await notification.save();

    
    res.status(200).json({ message: "Reschedule request declined successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// const updateRequest = async (req, res) => {
//   try {
//     const { requestId, status } = req.body;

//     // Find the reschedule request
//     const rescheduleRequest = await RescheduleRequest.findById(requestId);
//     if (!rescheduleRequest) {
//       return res.status(404).json({ message: "Reschedule request not found" });
//     }

//     // Update the status of the reschedule request
//     await RescheduleRequest.updateOne({ _id: requestId }, { status: status });

//     // If the request is accepted, update the game slots and game
//     if (status === "accepted") {
//       const game = await Game.findById(rescheduleRequest.game);
//       const originalSlot = await game.gameslot.populate();
//       const requestedSlot = await rescheduleRequest.requestedGameslot.populate();
      
//       await Gameslot.updateOne({ _id: originalSlot._id }, { game: null });
//       await Gameslot.updateOne({ _id: requestedSlot._id }, { game: game });
//       game.date = requestedSlot.date;
//       game.time = requestedSlot.time;
//       game.field = requestedSlot.field;
//       game.gameslot = requestedSlot._id;

//       await game.save();
//     }

//     // Create a notification for the requesting team
//     const notification = new Notification({
//       type: "update",
//       sender: rescheduleRequest.recipientTeam,
//       recipient: rescheduleRequest.requestingTeam,
//       message: `Your reschedule request has been ${status}.`,
//     });

//     await notification.save();

//     res
//       .status(200)
//       .json({ message: `Reschedule request ${status} successfully` });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find the reschedule request
        const rescheduleRequest = await RescheduleRequest.findById(requestId);
        if (!rescheduleRequest) {
            return res.status(404).json({ message: "Reschedule request not found" });
        }

        // Delete the reschedule request
        await RescheduleRequest.deleteOne({ _id: requestId });

        res.status(200).json({ message: "Reschedule request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find the reschedule request
        const rescheduleRequest = await RescheduleRequest.findById(requestId);
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
    // updateRequest,
    deleteRequest,
    getRequestById,
    getAllRequests,
    acceptRequest,
    declineRequest
};
