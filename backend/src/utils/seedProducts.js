const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  // T-Shirts
  {
    title: "Classic White Cotton T-Shirt",
    description: "Premium 100% cotton t-shirt with a comfortable fit. Perfect for everyday wear.",
    price: 499,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    stock: 50,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "White"
  },
  {
    title: "Black Round Neck T-Shirt",
    description: "Stylish black t-shirt made from soft cotton blend. Great for casual outings.",
    price: 549,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=500&fit=crop",
    stock: 45,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Black"
  },
  {
    title: "Navy Blue V-Neck T-Shirt",
    description: "Comfortable v-neck t-shirt in navy blue. Perfect for a smart casual look.",
    price: 599,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop",
    stock: 40,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Navy Blue"
  },
  {
    title: "Grey Melange Crew Neck T-Shirt",
    description: "Trendy grey melange t-shirt with a modern fit. Ideal for gym and casual wear.",
    price: 529,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&h=500&fit=crop",
    stock: 55,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Grey"
  },
  {
    title: "Red Graphic Print T-Shirt",
    description: "Bold red t-shirt with unique graphic print. Stand out from the crowd.",
    price: 649,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop",
    stock: 35,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Red"
  },
  {
    title: "Green Striped T-Shirt",
    description: "Fresh green t-shirt with horizontal stripes. Perfect for summer.",
    price: 579,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=500&fit=crop",
    stock: 42,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Green"
  },
  {
    title: "Yellow Pocket T-Shirt",
    description: "Bright yellow t-shirt with chest pocket. Add color to your wardrobe.",
    price: 559,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop",
    stock: 38,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Yellow"
  },
  {
    title: "Maroon Henley T-Shirt",
    description: "Classic maroon henley with button placket. Versatile and stylish.",
    price: 699,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop",
    stock: 30,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Maroon"
  },
  {
    title: "Olive Green Basic T-Shirt",
    description: "Military-inspired olive green t-shirt. Durable and comfortable.",
    price: 519,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=500&h=500&fit=crop",
    stock: 48,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Olive"
  },
  {
    title: "Sky Blue Polo T-Shirt",
    description: "Elegant sky blue polo t-shirt with collar. Perfect for semi-formal occasions.",
    price: 799,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=500&h=500&fit=crop",
    stock: 32,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Sky Blue"
  },

  // Shirts
  {
    title: "White Formal Shirt",
    description: "Crisp white formal shirt perfect for office and formal events.",
    price: 1299,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop",
    stock: 40,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "White"
  },
  {
    title: "Blue Checked Casual Shirt",
    description: "Stylish blue checked shirt for casual outings and weekends.",
    price: 1199,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
    stock: 35,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Blue"
  },
  {
    title: "Black Slim Fit Shirt",
    description: "Modern black slim fit shirt. Perfect for parties and events.",
    price: 1399,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&h=500&fit=crop",
    stock: 28,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Black"
  },
  {
    title: "Grey Linen Shirt",
    description: "Breathable grey linen shirt. Ideal for summer and tropical weather.",
    price: 1499,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&h=500&fit=crop",
    stock: 30,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Grey"
  },
  {
    title: "Pink Oxford Shirt",
    description: "Classic pink oxford shirt with button-down collar. Smart casual essential.",
    price: 1249,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1598032895397-b9c644f8d06a?w=500&h=500&fit=crop",
    stock: 33,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Pink"
  },
  {
    title: "Navy Blue Denim Shirt",
    description: "Rugged navy blue denim shirt. Perfect for a casual, laid-back look.",
    price: 1599,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop",
    stock: 25,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Navy"
  },
  {
    title: "Green Flannel Shirt",
    description: "Cozy green flannel shirt. Great for outdoor activities and cold weather.",
    price: 1349,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&h=500&fit=crop",
    stock: 27,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Green"
  },
  {
    title: "Beige Cotton Shirt",
    description: "Versatile beige cotton shirt. Pairs well with any bottom wear.",
    price: 1149,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1603252109360-909baaf261c7?w=500&h=500&fit=crop",
    stock: 38,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Beige"
  },
  {
    title: "Burgundy Satin Shirt",
    description: "Luxurious burgundy satin shirt. Perfect for special occasions.",
    price: 1799,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=500&h=500&fit=crop",
    stock: 20,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Burgundy"
  },
  {
    title: "Striped Business Shirt",
    description: "Professional striped shirt for business meetings and formal wear.",
    price: 1449,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1603252109612-e3b9e1e5e1a6?w=500&h=500&fit=crop",
    stock: 31,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Multi"
  },

  // Hoodies
  {
    title: "Black Pullover Hoodie",
    description: "Classic black pullover hoodie with kangaroo pocket. Ultimate comfort wear.",
    price: 1899,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
    stock: 35,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Black"
  },
  {
    title: "Grey Zip-Up Hoodie",
    description: "Comfortable grey zip-up hoodie. Perfect for layering.",
    price: 1999,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop",
    stock: 30,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Grey"
  },
  {
    title: "Navy Blue Graphic Hoodie",
    description: "Trendy navy blue hoodie with bold graphic print on front.",
    price: 2099,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=500&fit=crop",
    stock: 28,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Navy"
  },
  {
    title: "Maroon Fleece Hoodie",
    description: "Warm maroon fleece hoodie. Ideal for winter and cold climates.",
    price: 2199,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1618354691551-44de113f0164?w=500&h=500&fit=crop",
    stock: 25,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Maroon"
  },
  {
    title: "White Oversized Hoodie",
    description: "Trendy white oversized hoodie. Street style essential.",
    price: 2299,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=500&h=500&fit=crop",
    stock: 22,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "White"
  },
  {
    title: "Green Camo Hoodie",
    description: "Military-inspired green camo hoodie. Bold and stylish.",
    price: 2149,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500&h=500&fit=crop",
    stock: 27,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Green"
  },
  {
    title: "Red Sports Hoodie",
    description: "Athletic red hoodie with moisture-wicking fabric. Perfect for workouts.",
    price: 2399,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1620799140397-f1c1e0c5b1e6?w=500&h=500&fit=crop",
    stock: 24,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Red"
  },
  {
    title: "Charcoal Tech Hoodie",
    description: "Modern charcoal tech hoodie with hidden pockets. Urban style.",
    price: 2499,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=500&h=500&fit=crop",
    stock: 20,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Charcoal"
  },
  {
    title: "Purple Tie-Dye Hoodie",
    description: "Unique purple tie-dye hoodie. Stand out with vibrant colors.",
    price: 2249,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1620799140195-e3c8f6b1e3e3?w=500&h=500&fit=crop",
    stock: 18,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Purple"
  },
  {
    title: "Beige Sherpa Hoodie",
    description: "Cozy beige sherpa-lined hoodie. Maximum warmth and comfort.",
    price: 2599,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1620799140409-e3c6dcb6d633?w=500&h=500&fit=crop",
    stock: 15,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Beige"
  },

  // Additional T-Shirts
  {
    title: "Coral Pink T-Shirt",
    description: "Vibrant coral pink t-shirt. Perfect for beach and summer vibes.",
    price: 539,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&h=500&fit=crop",
    stock: 44,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Coral"
  },
  {
    title: "Mint Green T-Shirt",
    description: "Fresh mint green t-shirt. Cool and comfortable.",
    price: 529,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop",
    stock: 41,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Mint"
  },
  {
    title: "Lavender Purple T-Shirt",
    description: "Soft lavender purple t-shirt. Elegant and trendy.",
    price: 549,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=500&fit=crop",
    stock: 39,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Lavender"
  },
  {
    title: "Teal Blue T-Shirt",
    description: "Striking teal blue t-shirt. Make a statement.",
    price: 559,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop",
    stock: 37,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Teal"
  },
  {
    title: "Rust Orange T-Shirt",
    description: "Earthy rust orange t-shirt. Autumn essential.",
    price: 539,
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop",
    stock: 43,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Rust"
  },

  // Additional Shirts
  {
    title: "Mustard Yellow Shirt",
    description: "Bold mustard yellow shirt. Add warmth to your wardrobe.",
    price: 1279,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&h=500&fit=crop",
    stock: 29,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Mustard"
  },
  {
    title: "Teal Casual Shirt",
    description: "Refreshing teal casual shirt. Perfect for smart casual look.",
    price: 1329,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1598032895397-b9c644f8d06a?w=500&h=500&fit=crop",
    stock: 26,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Teal"
  },
  {
    title: "Lavender Formal Shirt",
    description: "Elegant lavender formal shirt. Stand out in meetings.",
    price: 1399,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop",
    stock: 24,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Lavender"
  },
  {
    title: "Charcoal Grey Shirt",
    description: "Sophisticated charcoal grey shirt. Versatile and timeless.",
    price: 1349,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&h=500&fit=crop",
    stock: 32,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Charcoal"
  },
  {
    title: "Cream Linen Shirt",
    description: "Light cream linen shirt. Perfect for tropical destinations.",
    price: 1449,
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1603252109360-909baaf261c7?w=500&h=500&fit=crop",
    stock: 28,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Cream"
  },

  // Additional Hoodies
  {
    title: "Olive Green Hoodie",
    description: "Military-style olive green hoodie. Rugged and durable.",
    price: 2049,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=500&fit=crop",
    stock: 26,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Olive"
  },
  {
    title: "Sky Blue Hoodie",
    description: "Light sky blue hoodie. Fresh and comfortable.",
    price: 1949,
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1618354691551-44de113f0164?w=500&h=500&fit=crop",
    stock: 29,
    size: ["S", "M", "L", "XL", "XXL"],
    color: "Sky Blue"
  }
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
    console.log(`${products.length} products seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
