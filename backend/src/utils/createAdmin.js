const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tshirt-shop');
    
    const existingAdmin = await Admin.findOne({ email: 'admin@tshirtshop.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = new Admin({
      name: 'Admin',
      email: 'admin@tshirtshop.com',
      password: 'admin123'
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: admin@tshirtshop.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
