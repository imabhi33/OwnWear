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

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(id);
    // emit socket event for real-time update
    try { req.app.get('io')?.emit('productDeleted', id); } catch(e){}
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};