const express = require('express');
const router = express.Router();
const { addToCart, getUserCart, getAllCarts } = require('../controllers/cartController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/add', protect(process.env.JWT_SECRET), addToCart);
router.get('/me', protect(process.env.JWT_SECRET), getUserCart);
router.get('/all', protect(process.env.JWT_SECRET), admin, getAllCarts);

module.exports = router;
