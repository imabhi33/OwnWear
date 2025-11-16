const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect(process.env.JWT_SECRET), getWishlist)
  .post(protect(process.env.JWT_SECRET), addToWishlist);

router.route('/toggle')
  .post(protect(process.env.JWT_SECRET), toggleWishlist);

router.route('/:id')
  .delete(protect(process.env.JWT_SECRET), removeFromWishlist);

module.exports = router;
