// Author: Jad Haytaoglu
// Description: Reschedule request-related operations
// including creating, accepting, declining, and deleting requests
// Last Modified: 2025-03-31

const Game = require("../models/game");
const Team = require("../models/team");
const Notification = require("../models/notification");
const Gameslot = require("../models/gameslot");
const RescheduleRequest = require("../models/reschedule-request");
const Schedule = require("../models/schedule");
const Season = require("../models/season");

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
      if (isSlotAvailable !== null) {
        return res
        .status(400)
        .json({ message: "New game slot is not available" });
      }
    }

    // Find the recipient team
    const recipientTeam = await Team.findById(recipientTeamId);
    if (!recipientTeam) {
      return res.status(404).json({ message: "Other team not found" });
    }

    const newGameSlots = await Gameslot.find({ _id: { $in: requestedGameslotIds } });
    const requestingTeam = await Team.findById(requestingTeamId);

    // create reschedule request
    const rescheduleRequest = new RescheduleRequest({
      gameId: gameId,
      requestingTeamId: requestingTeamId,
      recipientTeamId: recipientTeamId,
      requestedGameslotIds: requestedGameslotIds,
    });

    await rescheduleRequest.save();

    // Create a notification for the other team
    const notification = new Notification({
      type: "reschedule request",
      sender: requestingTeamId,
      recipient: recipientTeamId,
      message: `Team ${requestingTeam.name} has requested a reschedule`,
      rescheduleRequestId: rescheduleRequest._id,
    });

    await notification.save();

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

    // assign new notification to team.notifications array
    const requestingTeam = await Team.findById(rescheduleRequest.requestingTeamId);
    requestingTeam.notifications.push(notification._id);
    await requestingTeam.save();

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

    // assign new notification to team.notifications array
    const requestingTeam = await Team.findById(rescheduleRequest.requestingTeamId);
    requestingTeam.notifications.push(notification._id);
    await requestingTeam.save();
    
    console.log("reschedule request declined successfully");
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

const swapSlots = async (req, res) => {
  try {
    const { slot1Id, slot2Id } = req.body;

    // have to figure out if given objects are Gameslots or Games
    const slot1 = await Gameslot.findById(slot1Id) || await Game.findById(slot1Id);
    const slot2 = await Gameslot.findById(slot2Id) || await Game.findById(slot2Id);
    console.log("before slot1:", slot1);
    console.log("before slot2: ",slot2);

    if (!slot1 || !slot2) {
      return res.status(404).json({ message: "One or both slots not found" });
    }

    const isSlot1Gameslot = slot1 instanceof Gameslot;
    const isSlot2Gameslot = slot2 instanceof Gameslot;

    // 3 Cases
    if (!isSlot1Gameslot && !isSlot2Gameslot) {
      // Both slots are games – prepare update objects for each game
      const game1Update = {
        gameslot: slot2.gameslot,
        date: slot2.date,
        time: slot2.time,
        field: slot2.field,
      };

      const game2Update = {
        gameslot: slot1.gameslot,
        date: slot1.date,
        time: slot1.time,
        field: slot1.field,
      };

      // Execute update operations directly on the database
      await Game.updateOne({ _id: slot1._id }, game1Update);
      await Game.updateOne({ _id: slot2._id }, game2Update);

      // Update the Gameslot collection to reference the correct games
      await Gameslot.updateOne({ _id: slot2.gameslot }, { game: slot1._id });
      await Gameslot.updateOne({ _id: slot1.gameslot }, { game: slot2._id });
    } else if (!isSlot1Gameslot && isSlot2Gameslot) {
      // slot1 is a game, slot2 is a gameslot

      await Gameslot.updateOne({ _id: slot1.gameslot }, { game: null })

      await Game.updateOne(
        { _id: slot1._id },
        { 
          gameslot: slot2._id,
          date: slot2.date,
          time: slot2.time,
          field: slot2.field
        }
      );
      await Gameslot.updateOne({ _id: slot2._id }, { game: slot1._id });
    } else if (isSlot1Gameslot && !isSlot2Gameslot) {
      //slot1 is a gameslot, slot2 is a game

      await Gameslot.updateOne({ _id: slot2.gameslot }, { game: null })

      await Game.updateOne(
        { _id: slot2._id },
        { 
          gameslot: slot1._id,
          date: slot1.date,
          time: slot1.time,
          field: slot1.field
        }
      );
      await Gameslot.updateOne({ _id: slot1._id }, { game: slot2._id });
    } else {
      return res.status(400).json({ message: "Error swapping in controller" });
    }

    console.log("swap successful");
    console.log("after slot1:", slot1);
    console.log("after slot2: ",slot2);

    res.status(200).json({ message: "Slots swapped successfully" });
  } catch (error) {
    console.log("errored in controller", error, "done");
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
  getAvailableGameslots,
  swapSlots
};
