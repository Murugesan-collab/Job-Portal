const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { auth, isEmployer } = require('../middleware/auth');

// Get all jobs (with filters)
router.get('/', async (req, res) => {
  try {
    const { search, location, jobType, skills } = req.query;
    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email companyName')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email companyName website');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create job (Employer only)
router.post('/', auth, isEmployer, async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      location,
      jobType,
      salary,
      skills,
      experience,
    } = req.body;

    const job = new Job({
      title,
      company,
      description,
      requirements,
      location,
      jobType,
      salary,
      skills,
      experience,
      postedBy: req.user.id,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update job (Employer only)
router.put('/:id', auth, isEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job (Employer only)
router.delete('/:id', auth, isEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get jobs posted by employer
router.get('/employer/my-jobs', auth, isEmployer, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .populate('applicants')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;