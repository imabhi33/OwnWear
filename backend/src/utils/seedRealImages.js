const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Using Picsum Photos (reliable, free CDN that works everywhere)
const generateImageUrl = (id, text) => {
  return `https://picsum.photos/seed/${id}/500/500`;
};

const products = [
  // T-Shirts with real images
  ...Array.from({ length: 60 }, (_, i) => ({
    title: `Premium ${['Cotton', 'Blend', 'Organic', 'Soft'][i % 4]} T-Shirt ${i + 1}`,
    description: `High-quality t-shirt perfect for everyday wear. Made with premium materials for maximum comfort. Features modern fit and durable construction.`,
    price: 499 + (i * 10),
    originalPrice: 699 + (i * 10),
    discount: Math.floor(Math.random() * 30) + 10,
    imageUrl: generateImageUrl(`tshirt-${i}`, 'T-Shirt'),
    images: [
      generateImageUrl(`tshirt-${i}-front`, 'Front'),
      generateImageUrl(`tshirt-${i}-back`, 'Back'),
      generateImageUrl(`tshirt-${i}-side`, 'Side'),
      generateImageUrl(`tshirt-${i}-detail`, 'Detail')
    ],
    category: 'tshirt',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: ['White', 'Black', 'Navy', 'Grey', 'Red', 'Green', 'Blue', 'Yellow'][i % 8],
    stock: 20 + Math.floor(Math.random() * 50),
    brand: ['OwnWear', 'StyleHub', 'TrendyWear', 'UrbanFit'][i % 4],
    material: '100% Cotton',
    rating: 4 + Math.random(),
    reviews: Math.floor(Math.random() * 500) + 50,
    features: [
      'Premium cotton fabric',
      'Comfortable fit',
      'Breathable material',
      'Machine washable',
      'Fade resistant colors'
    ],
    specifications: {
      fit: ['Regular', 'Slim', 'Relaxed'][i % 3],
      pattern: ['Solid', 'Striped', 'Printed'][i % 3],
      sleeve: ['Half Sleeve', 'Full Sleeve'][i % 2],
      neckType: ['Round Neck', 'V-Neck', 'Polo'][i % 3],
      fabric: 'Cotton',
      washCare: 'Machine wash cold, tumble dry low'
    }
  })),

  // Shirts with real images
  ...Array.from({ length: 50 }, (_, i) => ({
    title: `${['Formal', 'Casual', 'Business', 'Smart'][i % 4]} Shirt ${i + 1}`,
    description: `Elegant shirt crafted from premium fabric. Perfect for both formal and casual occasions. Features modern cut and comfortable fit.`,
    price: 1199 + (i * 20),
    originalPrice: 1699 + (i * 20),
    discount: Math.floor(Math.random() * 35) + 15,
    imageUrl: generateImageUrl(`shirt-${i}`, 'Shirt'),
    images: [
      generateImageUrl(`shirt-${i}-front`, 'Front'),
      generateImageUrl(`shirt-${i}-back`, 'Back'),
      generateImageUrl(`shirt-${i}-side`, 'Side'),
      generateImageUrl(`shirt-${i}-collar`, 'Collar')
    ],
    category: 'shirt',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: ['White', 'Blue', 'Black', 'Grey', 'Pink', 'Navy', 'Green', 'Beige'][i % 8],
    stock: 15 + Math.floor(Math.random() * 40),
    brand: ['OwnWear', 'ClassicFit', 'EliteWear', 'PremiumStyle'][i % 4],
    material: ['Cotton', 'Linen', 'Cotton Blend'][i % 3],
    rating: 4.2 + Math.random() * 0.8,
    reviews: Math.floor(Math.random() * 400) + 30,
    features: [
      'Premium quality fabric',
      'Wrinkle resistant',
      'Easy care',
      'Comfortable collar',
      'Durable buttons'
    ],
    specifications: {
      fit: ['Slim Fit', 'Regular Fit', 'Relaxed Fit'][i % 3],
      pattern: ['Solid', 'Checked', 'Striped'][i % 3],
      sleeve: ['Full Sleeve', 'Half Sleeve'][i % 2],
      neckType: ['Spread Collar', 'Button Down', 'Cutaway'][i % 3],
      fabric: ['Cotton', 'Linen', 'Blend'][i % 3],
      washCare: 'Machine wash or dry clean'
    }
  })),

  // Hoodies with real images
  ...Array.from({ length: 50 }, (_, i) => ({
    title: `${['Pullover', 'Zip-Up', 'Fleece', 'Premium'][i % 4]} Hoodie ${i + 1}`,
    description: `Cozy hoodie perfect for cold weather. Made with premium fleece material for maximum warmth and comfort. Features adjustable drawstring hood.`,
    price: 1899 + (i * 30),
    originalPrice: 2699 + (i * 30),
    discount: Math.floor(Math.random() * 40) + 20,
    imageUrl: generateImageUrl(`hoodie-${i}`, 'Hoodie'),
    images: [
      generateImageUrl(`hoodie-${i}-front`, 'Front'),
      generateImageUrl(`hoodie-${i}-back`, 'Back'),
      generateImageUrl(`hoodie-${i}-side`, 'Side'),
      generateImageUrl(`hoodie-${i}-hood`, 'Hood')
    ],
    category: 'hoodie',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: ['Black', 'Grey', 'Navy', 'Maroon', 'White', 'Green', 'Red', 'Blue'][i % 8],
    stock: 10 + Math.floor(Math.random() * 35),
    brand: ['OwnWear', 'CozyFit', 'WarmWear', 'UrbanStyle'][i % 4],
    material: ['Cotton Fleece', 'Polyester Blend'][i % 2],
    rating: 4.3 + Math.random() * 0.7,
    reviews: Math.floor(Math.random() * 350) + 40,
    features: [
      'Warm fleece lining',
      'Adjustable hood',
      'Kangaroo pocket',
      'Ribbed cuffs and hem',
      'Soft and comfortable'
    ],
    specifications: {
      fit: ['Regular', 'Oversized', 'Slim'][i % 3],
      pattern: ['Solid', 'Printed', 'Graphic'][i % 3],
      sleeve: 'Full Sleeve',
      neckType: 'Hooded',
      fabric: ['Cotton Fleece', 'Polyester Blend'][i % 2],
      washCare: 'Machine wash cold, do not bleach'
    }
  }))
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-e-cart');
    console.log('MongoDB connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Insert new products
    await Product.insertMany(products);
    console.log(`${products.length} products with real images seeded successfully!`);

    // Show category breakdown
    const tshirts = products.filter(p => p.category === 'tshirt').length;
    const shirts = products.filter(p => p.category === 'shirt').length;
    const hoodies = products.filter(p => p.category === 'hoodie').length;
    
    console.log('\nCategory Breakdown:');
    console.log(`T-Shirts: ${tshirts}`);
    console.log(`Shirts: ${shirts}`);
    console.log(`Hoodies: ${hoodies}`);
    console.log(`Total: ${products.length}`);
    console.log('\n✅ All images use Picsum Photos CDN - will work after deployment!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
