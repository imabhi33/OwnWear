const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (jwtSecret) => async (req, res, next) => {
  let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if(!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' });
  }
};

const admin = (req, res, next) => {
  if(req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Admin only' });
}

module.exports = { protect, admin };
