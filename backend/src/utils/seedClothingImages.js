const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Real clothing images from Unsplash
const products = [
  // T-Shirts
  {
    title: "Classic White Cotton T-Shirt",
    description: "Premium 100% cotton t-shirt with comfortable fit. Perfect for everyday wear. Soft, breathable fabric.",
    price: 499,
    originalPrice: 699,
    discount: 29,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop"
    ],
    category: 'tshirt',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'White',
    stock: 50,
    brand: 'OwnWear',
    material: '100% Cotton',
    rating: 4.5,
    reviews: 234,
    features: ['Premium cotton', 'Comfortable fit', 'Breathable', 'Machine washable', 'Fade resistant'],
    specifications: {
      fit: 'Regular',
      pattern: 'Solid',
      sleeve: 'Half Sleeve',
      neckType: 'Round Neck',
      fabric: 'Cotton',
      washCare: 'Machine wash cold'
    }
  },
  {
    title: "Black Round Neck T-Shirt",
    description: "Stylish black t-shirt made from soft cotton blend. Great for casual outings and everyday comfort.",
    price: 549,
    originalPrice: 799,
    discount: 31,
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop"
    ],
    category: 'tshirt',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Black',
    stock: 45,
    brand: 'StyleHub',
    material: 'Cotton Blend',
    rating: 4.6,
    reviews: 189,
    features: ['Soft fabric', 'Durable', 'Comfortable', 'Easy care', 'Classic design'],
    specifications: {
      fit: 'Slim',
      pattern: 'Solid',
      sleeve: 'Half Sleeve',
      neckType: 'Round Neck',
      fabric: 'Cotton Blend',
      washCare: 'Machine wash'
    }
  },
  {
    title: "Navy Blue V-Neck T-Shirt",
    description: "Comfortable v-neck t-shirt in navy blue. Perfect for a smart casual look with jeans or chinos.",
    price: 599,
    originalPrice: 899,
    discount: 33,
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"
    ],
    category: 'tshirt',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Navy Blue',
    stock: 40,
    brand: 'TrendyWear',
    material: '100% Cotton',
    rating: 4.4,
    reviews: 156,
    features: ['V-neck design', 'Soft cotton', 'Breathable', 'Versatile', 'Easy to style'],
    specifications: {
      fit: 'Regular',
      pattern: 'Solid',
      sleeve: 'Half Sleeve',
      neckType: 'V-Neck',
      fabric: 'Cotton',
      washCare: 'Machine wash cold'
    }
  },

  // Shirts
  {
    title: "White Formal Shirt",
    description: "Crisp white formal shirt perfect for office and formal events. Premium fabric with modern cut.",
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&h=500&fit=crop"
    ],
    category: 'shirt',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'White',
    stock: 40,
    brand: 'ClassicFit',
    material: 'Cotton',
    rating: 4.7,
    reviews: 312,
    features: ['Formal design', 'Wrinkle resistant', 'Comfortable collar', 'Premium buttons', 'Easy care'],
    specifications: {
      fit: 'Slim Fit',
      pattern: 'Solid',
      sleeve: 'Full Sleeve',
      neckType: 'Spread Collar',
      fabric: 'Cotton',
      washCare: 'Machine wash or dry clean'
    }
  },
  {
    title: "Blue Checked Casual Shirt",
    description: "Stylish blue checked shirt for casual outings and weekends. Comfortable and trendy design.",
    price: 1199,
    originalPrice: 1699,
    discount: 29,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&h=500&fit=crop"
    ],
    category: 'shirt',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Blue',
    stock: 35,
    brand: 'UrbanFit',
    material: 'Cotton',
    rating: 4.5,
    reviews: 198,
    features: ['Checked pattern', 'Casual style', 'Comfortable', 'Durable', 'Easy to pair'],
    specifications: {
      fit: 'Regular Fit',
      pattern: 'Checked',
      sleeve: 'Full Sleeve',
      neckType: 'Button Down',
      fabric: 'Cotton',
      washCare: 'Machine wash'
    }
  },

  // Hoodies
  {
    title: "Black Pullover Hoodie",
    description: "Classic black pullover hoodie with kangaroo pocket. Ultimate comfort wear for cold weather.",
    price: 1899,
    originalPrice: 2699,
    discount: 30,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1618354691551-44de113f0164?w=500&h=500&fit=crop"
    ],
    category: 'hoodie',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Black',
    stock: 35,
    brand: 'CozyFit',
    material: 'Cotton Fleece',
    rating: 4.8,
    reviews: 445,
    features: ['Warm fleece', 'Adjustable hood', 'Kangaroo pocket', 'Ribbed cuffs', 'Soft interior'],
    specifications: {
      fit: 'Regular',
      pattern: 'Solid',
      sleeve: 'Full Sleeve',
      neckType: 'Hooded',
      fabric: 'Cotton Fleece',
      washCare: 'Machine wash cold'
    }
  },
  {
    title: "Grey Zip-Up Hoodie",
    description: "Comfortable grey zip-up hoodie. Perfect for layering and outdoor activities.",
    price: 1999,
    originalPrice: 2899,
    discount: 31,
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1618354691551-44de113f0164?w=500&h=500&fit=crop"
    ],
    category: 'hoodie',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Grey',
    stock: 30,
    brand: 'WarmWear',
    material: 'Polyester Blend',
    rating: 4.6,
    reviews: 287,
    features: ['Zip closure', 'Side pockets', 'Warm lining', 'Durable', 'Comfortable fit'],
    specifications: {
      fit: 'Regular',
      pattern: 'Solid',
      sleeve: 'Full Sleeve',
      neckType: 'Hooded',
      fabric: 'Polyester Blend',
      washCare: 'Machine wash'
    }
  }
];

// Generate more variations
const generateMoreProducts = () => {
  const allProducts = [...products];
  const colors = ['White', 'Black', 'Navy', 'Grey', 'Red', 'Green', 'Blue', 'Maroon', 'Olive', 'Beige'];
  
  // Generate more T-Shirts (total 60)
  for (let i = 0; i < 57; i++) {
    const baseProduct = products[i % 3];
    allProducts.push({
      ...baseProduct,
      title: `${colors[i % colors.length]} ${['Cotton', 'Premium', 'Classic', 'Soft'][i % 4]} T-Shirt`,
      price: 499 + (i * 10),
      originalPrice: 699 + (i * 10),
      color: colors[i % colors.length],
      stock: 20 + Math.floor(Math.random() * 50),
      rating: 4 + Math.random(),
      reviews: Math.floor(Math.random() * 500) + 50
    });
  }

  // Generate more Shirts (total 50)
  for (let i = 0; i < 48; i++) {
    const baseProduct = products[3 + (i % 2)];
    allProducts.push({
      ...baseProduct,
      title: `${colors[i % colors.length]} ${['Formal', 'Casual', 'Business', 'Smart'][i % 4]} Shirt`,
      price: 1199 + (i * 20),
      originalPrice: 1699 + (i * 20),
      color: colors[i % colors.length],
      stock: 15 + Math.floor(Math.random() * 40),
      rating: 4.2 + Math.random() * 0.8,
      reviews: Math.floor(Math.random() * 400) + 30
    });
  }

  // Generate more Hoodies (total 50)
  for (let i = 0; i < 48; i++) {
    const baseProduct = products[5 + (i % 2)];
    allProducts.push({
      ...baseProduct,
      title: `${colors[i % colors.length]} ${['Pullover', 'Zip-Up', 'Fleece', 'Premium'][i % 4]} Hoodie`,
      price: 1899 + (i * 30),
      originalPrice: 2699 + (i * 30),
      color: colors[i % colors.length],
      stock: 10 + Math.floor(Math.random() * 35),
      rating: 4.3 + Math.random() * 0.7,
      reviews: Math.floor(Math.random() * 350) + 40
    });
  }

  return allProducts;
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-e-cart');
    console.log('MongoDB connected');

    await Product.deleteMany({});
    console.log('Existing products cleared');

    const allProducts = generateMoreProducts();
    await Product.insertMany(allProducts);
    
    console.log(`\n✅ ${allProducts.length} products seeded with REAL clothing images!`);
    
    const tshirts = allProducts.filter(p => p.category === 'tshirt').length;
    const shirts = allProducts.filter(p => p.category === 'shirt').length;
    const hoodies = allProducts.filter(p => p.category === 'hoodie').length;
    
    console.log('\nCategory Breakdown:');
    console.log(`👕 T-Shirts: ${tshirts}`);
    console.log(`👔 Shirts: ${shirts}`);
    console.log(`🧥 Hoodies: ${hoodies}`);
    console.log(`📦 Total: ${allProducts.length}`);
    console.log('\n🖼️  All images are real clothing photos from Unsplash!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
