const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect(process.env.JWT_SECRET), createOrder)
  .get(protect(process.env.JWT_SECRET), getMyOrders);

router.route('/all')
  .get(protect(process.env.JWT_SECRET), admin, getAllOrders);

router.route('/:id')
  .get(protect(process.env.JWT_SECRET), getOrderById);

router.route('/:id/status')
  .put(protect(process.env.JWT_SECRET), admin, updateOrderStatus);

router.route('/:id/cancel')
  .put(protect(process.env.JWT_SECRET), cancelOrder);

module.exports = router;
