const express = require('express');
const controller = require('../controllers/notificationController');

const router = express.Router();

// Controller functions (you need to implement these)

// Get all notifications
router.get('/', controller.getAllNotifications);

// Get a single notification by ID
router.get('/:id', controller.getNotificationById);

// Create a new notification
router.post('/', controller.createNotification);

// Update a notification by ID
router.put('/:id', controller.updateNotification);

// Delete a notification by ID
router.delete('/:id', controller.deleteNotification);

module.exports = router;