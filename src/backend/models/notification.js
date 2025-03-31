const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for the Notification model
// This model represents notifications sent between teams
// It includes the type of notification, the message, sender, recipient, and status
// The type can be 'reschedule request', 'update', 'team invite', or 'other'
const notificationSchema = new Schema({
    type: {
        type: String,
        enum: ['reschedule request', 'update', 'team invite', 'other'],
        required: true
    },
    rescheduleRequestId: {
        type: Schema.Types.ObjectId,
        ref: 'RescheduleRequest',
        required: false
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);