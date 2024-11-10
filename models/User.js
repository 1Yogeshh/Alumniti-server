const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student', 'alumni'], required: true },
  isApproved: { type: Boolean, default: false }, // Needs admin approval
  college:{type:String, required:true},
  education: [
    {
      name: { type: String }, // College name
      year: { type: String }, // Year of attendance
      degree: { type: String } // Degree obtained
    }
  ],
  skills: { type: [String] }, // Array of skills
  jobs: [
    {
      title: { type: String },
      company: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      description: { type: String },
    },
  ],
  about:{type:String},
  location:{type:String},
  currentjob:{type:String},
  portfolio:{type:String},
  github:{type:String},
  linkdin:{type:String},
  img:{
    type:String,
    default:''
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
