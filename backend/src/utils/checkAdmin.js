const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-e-cart');
    
    console.log('Connected to database');
    
    // Find all admins
    const admins = await Admin.find();
    console.log('\n📊 Total admins in database:', admins.length);
    
    if (admins.length > 0) {
      console.log('\n👥 Admin accounts:');
      admins.forEach((admin, index) => {
        console.log(`\n${index + 1}. Admin Details:`);
        console.log('   ID:', admin._id);
        console.log('   Name:', admin.name);
        console.log('   Email:', admin.email);
        console.log('   Role:', admin.role);
        console.log('   Password Hash:', admin.password.substring(0, 20) + '...');
        console.log('   Created:', admin.createdAt);
      });
      
      // Test password comparison
      console.log('\n🔐 Testing password comparison...');
      const testAdmin = admins[0];
      const testPassword = 'admin123';
      const isMatch = await testAdmin.comparePassword(testPassword);
      console.log(`Password "${testPassword}" matches:`, isMatch);
      
      if (!isMatch) {
        console.log('\n⚠️  Password does not match! Resetting admin password...');
        testAdmin.password = 'admin123';
        await testAdmin.save();
        console.log('✅ Password reset to: admin123');
        
        // Test again
        const updatedAdmin = await Admin.findById(testAdmin._id);
        const isMatchNow = await updatedAdmin.comparePassword('admin123');
        console.log('Password now matches:', isMatchNow);
      }
    } else {
      console.log('\n❌ No admin accounts found!');
      console.log('Creating default admin...');
      
      const admin = new Admin({
        name: 'Admin',
        email: 'admin@tshirtshop.com',
        password: 'admin123'
      });
      
      await admin.save();
      console.log('✅ Admin created successfully');
      console.log('Email: admin@tshirtshop.com');
      console.log('Password: admin123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkAdmin();
