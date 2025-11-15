const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if(exists) return res.status(400).json({ message: 'User already exists' });
  
  // Split name into firstName and lastName
  const nameParts = name ? name.trim().split(' ') : ['', ''];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  const user = await User.create({ firstName, lastName, email, password, role });
  res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, token: generateToken(user, process.env.JWT_SECRET) });
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(user && await user.matchPassword(password)){
    return res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, token: generateToken(user, process.env.JWT_SECRET) });
  }
  res.status(401).json({ message: 'Invalid credentials' });
}
