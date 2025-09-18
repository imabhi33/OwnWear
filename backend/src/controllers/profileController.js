const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, mobile, gender, dateOfBirth } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        firstName, 
        lastName, 
        mobile, 
        gender, 
        dateOfBirth
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Update profile picture
exports.updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: imageUrl },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ message: 'Error updating profile picture' });
  }
};

// Add new address
exports.addAddress = async (req, res) => {
  try {
    const { type, street, city, state, pincode, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({ type, street, city, state, pincode, isDefault });
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Error adding address' });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    Object.assign(address, req.body);
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Error updating address' });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Error deleting address' });
  }
};