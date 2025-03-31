const mongoose = require('mongoose');

// Define the schema for the Announcement model
const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces from the start and end
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the timestamp for creation
  },
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
