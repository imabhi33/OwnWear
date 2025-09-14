const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getProducts);
router.post('/', protect(process.env.JWT_SECRET), admin, createProduct);

module.exports = router;
