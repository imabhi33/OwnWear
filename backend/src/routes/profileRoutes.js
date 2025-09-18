const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middlewares/authMiddleware');
const { 
  getProfile,
  updateProfile,
  updateProfilePic,
  addAddress,
  updateAddress,
  deleteAddress 
} = require('../controllers/profileController');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/profiles'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Profile routes
router.get('/', protect(process.env.JWT_SECRET), getProfile);
router.put('/', protect(process.env.JWT_SECRET), updateProfile);
router.post('/profile-pic', protect(process.env.JWT_SECRET), upload.single('profilePic'), updateProfilePic);

// Address routes
router.post('/address', protect(process.env.JWT_SECRET), addAddress);
router.put('/address/:addressId', protect(process.env.JWT_SECRET), updateAddress);
router.delete('/address/:addressId', protect(process.env.JWT_SECRET), deleteAddress);

module.exports = router;