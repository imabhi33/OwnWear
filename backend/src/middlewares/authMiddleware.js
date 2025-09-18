const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (jwtSecret) => async (req, res, next) => {
  let token;
  
  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('No token found in request:', {
      headers: req.headers,
      path: req.path
    });
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('No user found for token payload:', decoded);
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token invalid' });
  }
};

const admin = (req, res, next) => {
  if(req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Admin only' });
}

module.exports = { protect, admin };
