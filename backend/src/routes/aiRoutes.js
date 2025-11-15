const express = require('express');
const { chatWithSupport } = require('../controllers/aiController');

const router = express.Router();

// Route to chat with support (no authentication required)
router.post('/chat', chatWithSupport);

module.exports = router;