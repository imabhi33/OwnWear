const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  const existing = await Cart.findOne({ user: req.user._id, product: productId });
  if(existing){
    existing.qty += qty || 1;
    await existing.save();
    return res.json(existing);
  }
  const item = await Cart.create({ user: req.user._id, product: productId, qty: qty || 1 });
  res.json(item);
}

exports.getUserCart = async (req, res) => {
  const items = await Cart.find({ user: req.user._id }).populate('product');
  res.json(items);
}

exports.getAllCarts = async (req, res) => {
  const items = await Cart.find({}).populate('product').populate('user','name email');
  res.json(items);
}

exports.removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const cartItem = await Cart.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Ensure the cart item belongs to the user
    if (cartItem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to remove this item' });
    }

    await Cart.findByIdAndDelete(cartItemId);
    
    // Return updated cart
    const updatedCart = await Cart.find({ user: req.user._id }).populate('product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
}
