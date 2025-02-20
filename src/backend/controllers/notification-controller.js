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
        console.log("this ran");
        const team = await Team.findById(req.params.id).populate('notifications');
        // console.log("team from notifications: ", team);
        // console.log("req.params: ", req.params);

        if (!team) {
            return res.status(404).send();
        }

        // console.log("team.notifications: ", team.notifications);
        res.send(team.notifications);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

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

    if (!notification) {
      return res.status(404).send();
    }

    // Update the status to 'read' if the user clicks on the notification
    notification.status = "read";
    await notification.save();

    // Schedule deletion after 24 hours
    setTimeout(async () => {
      const notificationToDelete = await Notification.findByIdAndDelete(
        req.params.id
      );
      if (notificationToDelete) {
        const team = await Team.findById(notificationToDelete.recipient);
        if (team) {
          team.notifications = team.notifications.filter(
            (notifId) => notifId.toString() !== req.params.id
          );
          await team.save();
        }
      }
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

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
