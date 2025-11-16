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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate reset token (valid for 1 hour)
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // In production, you would send an email here
    // For now, we'll just return the reset URL in the response
    console.log('Password Reset URL:', resetUrl);
    console.log('Reset Token:', resetToken);

    res.json({ 
      message: 'Password reset link sent successfully',
      // In development, include the token. Remove this in production!
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the token from URL to compare with stored hash
    const crypto = require('crypto');
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ 
      message: 'Password reset successful',
      token: generateToken(user, process.env.JWT_SECRET)
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
}
