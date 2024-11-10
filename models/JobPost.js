const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  companyWebsite: { type: String, required: true },
  jobType: { type: String, required: true }, // e.g., Full-time, Part-time, Internship
  salary: { type: String }, // Salary can be optional or a range
  jobDescription: { type: String, required: true },
  jobApplyLink: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who posted the job
  datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
