const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  imageUrl: { type: String },
  images: [{ type: String }], // Multiple images for different angles
  category: { type: String, default: 'tshirt' },
  size: [{ type: String }],
  color: { type: String },
  stock: { type: Number, default: 0 },
  brand: { type: String },
  material: { type: String },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  features: [{ type: String }],
  specifications: {
    fit: String,
    pattern: String,
    sleeve: String,
    neckType: String,
    fabric: String,
    washCare: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
