const express = require('express');
const rescheduleController = require('../controllers/reschedule-controller');

const router = express.Router();

// Route to get all reschedule requests
router.get('/', rescheduleController.getAllRequests);

// Route to get available game slots
router.get('/available-gameslots', rescheduleController.getAvailableGameslots);

// Route to get a specific reschedule request by ID
router.get('/:id', rescheduleController.getRequestById);

// Route to create a new reschedule request
router.post('/create', rescheduleController.createRequest);

// Route to accept a reschedule request by ID
router.put('/:rescheduleRequestId/accept', rescheduleController.acceptRequest);

// Route to decline a reschedule request by ID
router.put('/:rescheduleRequestId/decline', rescheduleController.declineRequest);

// Route to update an existing reschedule request by ID
// router.put('/:id', rescheduleController.updateRequest);

// Route to delete a reschedule request by ID
router.delete('/:id', rescheduleController.deleteRequest);

module.exports = router;