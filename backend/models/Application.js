const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverLetter: {
    type: String,
  },
  resume: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', ApplicationSchema);