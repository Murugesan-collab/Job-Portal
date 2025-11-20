const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, isJobSeeker, isEmployer } = require('../middleware/auth');

// Apply for a job (Job Seeker only)
router.post('/', auth, isJobSeeker, async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume,
    });

    await application.save();

    // Add application to job's applicants array
    job.applicants.push(application._id);
    await job.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all applications for a job seeker
router.get('/my-applications', auth, isJobSeeker, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all applications for a specific job (Employer only)
router.get('/job/:jobId', auth, isEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if employer owns the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone skills experience education resume')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update application status (Employer only)
router.put('/:id/status', auth, isEmployer, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if employer owns the job
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single application details
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name email phone skills experience education resume');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization
    if (
      req.user.role === 'jobseeker' &&
      application.applicant._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (
      req.user.role === 'employer' &&
      application.job.postedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;