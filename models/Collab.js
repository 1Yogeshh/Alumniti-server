const mongoose = require('mongoose');

const collabSchema = new mongoose.Schema({
  collabTitle: { type: String, required: true },
  RoleNeed: { type: String, required: true },
  skills: { type: String, required: true },
  startDate:{type:Date},
  endDate:{type:Date},
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who posted the job
  datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Collab', collabSchema);