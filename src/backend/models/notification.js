const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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