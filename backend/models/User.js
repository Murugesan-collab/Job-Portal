const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer'],
    required: true,
  },
  phone: {
    type: String,
  },
  // Job Seeker specific fields
  resume: {
    type: String, // URL to uploaded resume
  },
  skills: [{
    type: String,
  }],
  experience: {
    type: String,
  },
  education: {
    type: String,
  },
  // Employer specific fields
  companyName: {
    type: String,
  },
  companyDescription: {
    type: String,
  },
  website: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);