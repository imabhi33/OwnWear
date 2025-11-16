const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create new order
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId || item.product);
    if (product) {
      subtotal += product.price * item.qty;
      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        qty: item.qty,
        imageUrl: product.imageUrl
      });
    }
  }

  const shippingCharges = subtotal > 500 ? 0 : 50;
  const discount = 0;
  const total = subtotal + shippingCharges - discount;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    subtotal,
    shippingCharges,
    discount,
    total
  });

  // Clear cart after order
  await Cart.deleteMany({ user: req.user._id });

  const populatedOrder = await Order.findById(order._id).populate('items.product');
  
  res.status(201).json(populatedOrder);
});

// Get user's orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product')
    .sort({ createdAt: -1 });
  
  res.json(orders);
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json(order);
});

// Update order status (Admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  if (orderStatus === 'delivered') {
    order.deliveryDate = Date.now();
  }

  const updatedOrder = await order.save();
  
  res.json(updatedOrder);
});

// Get all orders (Admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .populate('items.product')
    .sort({ createdAt: -1 });
  
  res.json(orders);
});

// Cancel order
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Can only cancel if order is pending or confirmed
  if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
    res.status(400);
    throw new Error('Cannot cancel order at this stage');
  }

  order.orderStatus = 'cancelled';
  await order.save();

  res.json({ message: 'Order cancelled successfully', order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
};
