const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: String, default: 'tshirt' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
