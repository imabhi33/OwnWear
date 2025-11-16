const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.post('/login', adminController.adminLogin);
router.post('/register', adminController.adminRegister);

// Protected routes
router.get('/analytics', adminAuth, adminController.getAnalytics);
router.get('/users', adminAuth, adminController.getAllUsers);
router.delete('/users/:id', adminAuth, adminController.deleteUser);
router.get('/products', adminAuth, adminController.getAllProducts);
router.post('/products', adminAuth, adminController.addProduct);
router.put('/products/:id', adminAuth, adminController.updateProduct);
router.delete('/products/:id', adminAuth, adminController.deleteProduct);
router.get('/orders', adminAuth, adminController.getAllOrders);
router.put('/orders/:id/status', adminAuth, adminController.updateOrderStatus);

module.exports = router;
