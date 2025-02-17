const Notification = require('../models/notification-model');

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).send(notification);
    } catch (error) {
        res.status(400).send(error);
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
        notification.status = 'read';
        await notification.save();

        // Schedule deletion after 24 hours
        setTimeout(async () => {
            await Notification.findByIdAndDelete(req.params.id);
        }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

        res.send(notification);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).send();
        }

        res.send(notification);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createNotification,
    updateNotification,
    deleteNotification
};