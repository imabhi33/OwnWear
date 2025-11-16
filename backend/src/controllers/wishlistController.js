const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const wishlistItems = await Wishlist.find({ user: req.user._id })
    .populate('product')
    .sort({ createdAt: -1 });
  
  res.json(wishlistItems);
});

// Add item to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if already in wishlist
  const existingItem = await Wishlist.findOne({
    user: req.user._id,
    product: productId
  });

  if (existingItem) {
    res.status(400);
    throw new Error('Product already in wishlist');
  }

  // Add to wishlist
  const wishlistItem = await Wishlist.create({
    user: req.user._id,
    product: productId
  });

  const populatedItem = await Wishlist.findById(wishlistItem._id).populate('product');
  
  res.status(201).json(populatedItem);
});

// Remove item from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const wishlistItem = await Wishlist.findById(id);

  if (!wishlistItem) {
    res.status(404);
    throw new Error('Wishlist item not found');
  }

  // Check if the wishlist item belongs to the user
  if (wishlistItem.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await wishlistItem.deleteOne();
  
  res.json({ message: 'Item removed from wishlist' });
});

// Toggle wishlist (add if not exists, remove if exists)
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if already in wishlist
  const existingItem = await Wishlist.findOne({
    user: req.user._id,
    product: productId
  });

  if (existingItem) {
    // Remove from wishlist
    await existingItem.deleteOne();
    res.json({ message: 'Removed from wishlist', inWishlist: false });
  } else {
    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      product: productId
    });
    const populatedItem = await Wishlist.findById(wishlistItem._id).populate('product');
    res.status(201).json({ message: 'Added to wishlist', inWishlist: true, item: populatedItem });
  }
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist
};
