const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true,
  },
  salary: {
    type: String,
  },
  skills: [{
    type: String,
  }],
  experience: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', JobSchema);