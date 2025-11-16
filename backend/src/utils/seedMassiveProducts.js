const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Helper function to generate product variations
const generateProducts = () => {
  const products = [];
  
  // T-Shirt variations
  const tshirtColors = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Navy Blue', hex: '#000080' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Sky Blue', hex: '#87CEEB' },
    { name: 'Coral', hex: '#FF7F50' },
    { name: 'Mint', hex: '#98FF98' },
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Teal', hex: '#008080' },
    { name: 'Rust', hex: '#B7410E' }
  ];

  const tshirtStyles = [
    'Classic Round Neck',
    'V-Neck',
    'Polo',
    'Henley',
    'Crew Neck',
    'Pocket',
    'Striped',
    'Graphic Print',
    'Plain',
    'Oversized'
  ];

  // Generate 60 T-Shirts
  tshirtColors.forEach((color, idx) => {
    for (let i = 0; i < 4; i++) {
      const style = tshirtStyles[Math.floor(Math.random() * tshirtStyles.length)];
      const price = 499 + Math.floor(Math.random() * 500);
      const discount = [0, 10, 15, 20, 25][Math.floor(Math.random() * 5)];
      
      products.push({
        title: `${color.name} ${style} T-Shirt`,
        description: `Premium quality ${color.name.toLowerCase()} ${style.toLowerCase()} t-shirt made from 100% cotton. Comfortable fit perfect for everyday wear. Breathable fabric keeps you cool all day.`,
        price: price,
        originalPrice: discount > 0 ? Math.floor(price / (1 - discount / 100)) : price,
        discount: discount,
        imageUrl: `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=${encodeURIComponent(color.name + ' T-Shirt')}`,
        images: [
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=Front+View`,
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=Back+View`,
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=Side+View`,
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=Detail+View`
        ],
        category: 'tshirt',
        size: ['S', 'M', 'L', 'XL', 'XXL'],
        color: color.name,
        stock: 30 + Math.floor(Math.random() * 50),
        brand: ['OwnWear', 'StyleHub', 'TrendyWear', 'UrbanFit'][Math.floor(Math.random() * 4)],
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
          fit: ['Regular', 'Slim', 'Relaxed'][Math.floor(Math.random() * 3)],
          pattern: ['Solid', 'Striped', 'Printed'][Math.floor(Math.random() * 3)],
          sleeve: ['Half Sleeve', 'Full Sleeve'][Math.floor(Math.random() * 2)],
          neckType: ['Round Neck', 'V-Neck', 'Polo'][Math.floor(Math.random() * 3)],
          fabric: 'Cotton',
          washCare: 'Machine wash cold, tumble dry low'
        }
      });
    }
  });

  // Shirt variations
  const shirtColors = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Green', hex: '#008000' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Mustard', hex: '#FFDB58' }
  ];

  const shirtStyles = [
    'Formal',
    'Casual',
    'Checked',
    'Striped',
    'Denim',
    'Linen',
    'Oxford',
    'Flannel',
    'Slim Fit',
    'Regular Fit'
  ];

  // Generate 50 Shirts
  shirtColors.forEach((color, idx) => {
    for (let i = 0; i < 5; i++) {
      const style = shirtStyles[Math.floor(Math.random() * shirtStyles.length)];
      const price = 1199 + Math.floor(Math.random() * 800);
      const discount = [0, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
      
      products.push({
        title: `${color.name} ${style} Shirt`,
        description: `Elegant ${color.name.toLowerCase()} ${style.toLowerCase()} shirt crafted from premium fabric. Perfect for both formal and casual occasions. Features modern cut and comfortable fit.`,
        price: price,
        originalPrice: discount > 0 ? Math.floor(price / (1 - discount / 100)) : price,
        discount: discount,
        imageUrl: `https://via.placeholder.com/500/${color.hex.replace('#', '')}/000000?text=${encodeURIComponent(color.name + ' Shirt')}`,
        images: [
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/000000?text=Front+View`,
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/000000?text=Back+View`,
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/000000?text=Side+View`,
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/000000?text=Collar+Detail`
        ],
        category: 'shirt',
        size: ['S', 'M', 'L', 'XL', 'XXL'],
        color: color.name,
        stock: 25 + Math.floor(Math.random() * 40),
        brand: ['OwnWear', 'ClassicFit', 'EliteWear', 'PremiumStyle'][Math.floor(Math.random() * 4)],
        material: ['Cotton', 'Linen', 'Cotton Blend', 'Polyester Blend'][Math.floor(Math.random() * 4)],
        rating: 4 + Math.random(),
        reviews: Math.floor(Math.random() * 400) + 30,
        features: [
          'Premium quality fabric',
          'Wrinkle resistant',
          'Easy care',
          'Comfortable collar',
          'Durable buttons'
        ],
        specifications: {
          fit: ['Slim Fit', 'Regular Fit', 'Relaxed Fit'][Math.floor(Math.random() * 3)],
          pattern: ['Solid', 'Checked', 'Striped', 'Printed'][Math.floor(Math.random() * 4)],
          sleeve: ['Full Sleeve', 'Half Sleeve'][Math.floor(Math.random() * 2)],
          neckType: ['Spread Collar', 'Button Down', 'Cutaway Collar'][Math.floor(Math.random() * 3)],
          fabric: ['Cotton', 'Linen', 'Cotton Blend'][Math.floor(Math.random() * 3)],
          washCare: 'Machine wash or dry clean'
        }
      });
    }
  });

  // Hoodie variations
  const hoodieColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Green', hex: '#008000' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Charcoal', hex: '#36454F' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Beige', hex: '#F5F5DC' }
  ];

  const hoodieStyles = [
    'Pullover',
    'Zip-Up',
    'Graphic',
    'Fleece',
    'Oversized',
    'Sports',
    'Tech',
    'Sherpa',
    'Basic',
    'Premium'
  ];

  // Generate 50 Hoodies
  hoodieColors.forEach((color, idx) => {
    for (let i = 0; i < 5; i++) {
      const style = hoodieStyles[Math.floor(Math.random() * hoodieStyles.length)];
      const price = 1899 + Math.floor(Math.random() * 900);
      const discount = [0, 20, 25, 30, 35][Math.floor(Math.random() * 5)];
      
      products.push({
        title: `${color.name} ${style} Hoodie`,
        description: `Cozy ${color.name.toLowerCase()} ${style.toLowerCase()} hoodie perfect for cold weather. Made with premium fleece material for maximum warmth and comfort. Features adjustable drawstring hood and kangaroo pocket.`,
        price: price,
        originalPrice: discount > 0 ? Math.floor(price / (1 - discount / 100)) : price,
        discount: discount,
        imageUrl: `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=${encodeURIComponent(color.name + ' Hoodie')}`,
        images: [
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=Front+View`,
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=Back+View`,
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=Side+View`,
          `https://via.placeholder.com/500/${color.hex.replace('#', '')}/FFFFFF?text=Hood+Detail`
        ],
        category: 'hoodie',
        size: ['S', 'M', 'L', 'XL', 'XXL'],
        color: color.name,
        stock: 20 + Math.floor(Math.random() * 35),
        brand: ['OwnWear', 'CozyFit', 'WarmWear', 'UrbanStyle'][Math.floor(Math.random() * 4)],
        material: ['Cotton Fleece', 'Polyester Blend', 'Cotton Blend'][Math.floor(Math.random() * 3)],
        rating: 4.2 + Math.random() * 0.8,
        reviews: Math.floor(Math.random() * 350) + 40,
        features: [
          'Warm fleece lining',
          'Adjustable hood',
          'Kangaroo pocket',
          'Ribbed cuffs and hem',
          'Soft and comfortable'
        ],
        specifications: {
          fit: ['Regular', 'Oversized', 'Slim'][Math.floor(Math.random() * 3)],
          pattern: ['Solid', 'Printed', 'Graphic'][Math.floor(Math.random() * 3)],
          sleeve: 'Full Sleeve',
          neckType: 'Hooded',
          fabric: ['Cotton Fleece', 'Polyester Blend'][Math.floor(Math.random() * 2)],
          washCare: 'Machine wash cold, do not bleach'
        }
      });
    }
  });

  return products;
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-e-cart');
    console.log('MongoDB connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Generate and insert products
    const products = generateProducts();
    await Product.insertMany(products);
    console.log(`${products.length} products seeded successfully!`);

    // Show category breakdown
    const tshirts = products.filter(p => p.category === 'tshirt').length;
    const shirts = products.filter(p => p.category === 'shirt').length;
    const hoodies = products.filter(p => p.category === 'hoodie').length;
    
    console.log('\nCategory Breakdown:');
    console.log(`T-Shirts: ${tshirts}`);
    console.log(`Shirts: ${shirts}`);
    console.log(`Hoodies: ${hoodies}`);
    console.log(`Total: ${products.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
