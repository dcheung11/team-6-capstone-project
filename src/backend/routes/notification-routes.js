// Author: Jad Haytaoglu
// Description: Routes for notification-related operations
// Last Modified: 2025-03-29

const express = require('express');
const controller = require('../controllers/notification-controller');

const router = express.Router();

// Get all notifications
router.get('/all', controller.getAllNotifications);

// Create a new notification
router.post('/create', controller.createNotification);

// Get all notifications for a team
router.get('/team/:id', controller.getNotificationsByTeamId);

// Update a notification by ID
router.put('/:id/update', controller.updateNotification);

// Get a single notification by ID
router.get('/:id', controller.getNotificationById);

// Delete a notification by ID
router.delete('/:id/delete', controller.deleteNotification);

module.exports = router;