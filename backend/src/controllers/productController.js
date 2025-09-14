const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { title, description, price, imageUrl, category } = req.body;
  const p = await Product.create({ title, description, price, imageUrl, category });
  // emit socket event if socket present on req.app
  try { req.app.get('io')?.emit('productAdded', p); } catch(e){}
  res.json(p);
}

exports.getProducts = async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
}
