const Notification = require("../models/notification");
const Team = require("../models/team"); // Assuming you have a Team model

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();

    // Update the recipient team's notifications array
    const team = await Team.findById(notification.recipient);
    if (team) {
      team.notifications.push(notification._id);
      await team.save();
    }

    res.status(201).send(notification);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getNotificationsByTeamId = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('notifications');

        if (!team) {
            return res.status(404).send();
        }

        res.send(team.notifications);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id)
        .populate("recipient sender")
        .populate({
          path: "rescheduleRequestId",
          populate: {
            path: "gameId requestedGameslotIds",
          }
        });

        if (!notification) {
            return res.status(404).send();
        }

        res.send(notification);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({});
        res.send(notifications);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update an existing notification
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    const newStatus = req.body.status;

    if (!notification) {
      return res.status(404).send();
    }

    notification.status = newStatus;
    await notification.save();

    res.send(notification);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a notification - this may not ever be used
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).send();
    }

    // Update the recipient team's notifications array
    const team = await Team.findById(notification.teamId);
    if (team) {
      team.notifications = team.notifications.filter(
        (notifId) => notifId.toString() !== req.params.id
      );
      await team.save();
    }

    res.send(notification);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
    createNotification,
    updateNotification,
    deleteNotification,
    getNotificationById,
    getAllNotifications,
    getNotificationsByTeamId
};
