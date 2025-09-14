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
