const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const isEmployer = (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Access denied. Employer only.' });
  }
  next();
};

const isJobSeeker = (req, res, next) => {
  if (req.user.role !== 'jobseeker') {
    return res.status(403).json({ message: 'Access denied. Job seeker only.' });
  }
  next();
};

module.exports = { auth, isEmployer, isJobSeeker };