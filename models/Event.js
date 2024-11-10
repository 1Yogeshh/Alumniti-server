const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  organizedBy: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  joinLink: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who posted the job
  datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
