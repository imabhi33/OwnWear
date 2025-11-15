const asyncHandler = require("express-async-handler");

// Support chat responses based on common queries
const getSupportResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  // Greeting patterns
  if (message.includes('hi') || message.includes('hello') || message.includes('hey') || message.includes('hy') || message === 'h') {
    return "Hello! How can I help you today? 😊 I'm here to assist with products, orders, shipping, and more!";
  }
  
  // Thank you
  if (message.includes('thank') || message.includes('thanks') || message.includes('thx')) {
    return "You're welcome! Happy to help! If you need anything else, just let me know. 😊";
  }
  
  // Goodbye
  if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
    return "Goodbye! Thanks for chatting with us. Have a great day! 👋";
  }
  
  // Help patterns
  if (message.includes('help') || message.includes('assist') || message === '?') {
    return "I'm here to help! You can ask me about:\n• Products & T-shirts\n• Orders & Tracking\n• Returns & Exchanges\n• Sizing & Fit\n• Shipping & Delivery\n• Payments\n• Account Issues\n\nWhat would you like to know?";
  }
  
  // Product related
  if (message.includes('product') || message.includes('t-shirt') || message.includes('shirt') || message.includes('cloth') || message.includes('item')) {
    return "Our T-shirt collection features premium quality fabrics! 👕\n\n• 100% Cotton & Cotton Blends\n• Graphic Prints & Solid Colors\n• Sizes: S, M, L, XL, XXL\n• Prices starting at $19.99\n• New arrivals every week\n\nBrowse our collection on the home page!";
  }
  
  // Order related
  if (message.includes('order') || message.includes('track') || message.includes('status')) {
    return "Order Information:\n• Track orders in your account dashboard\n• Order confirmation sent via email\n• Updates at every shipping stage\n• Average processing: 1-2 business days\n\nNeed help with a specific order? Please provide your order number!";
  }
  
  // Shipping/Delivery
  if (message.includes('delivery') || message.includes('shipping') || message.includes('ship')) {
    return "Shipping Options:\n• Standard Delivery: 5-7 business days\n• Express Delivery: 2-3 business days\n• FREE shipping on orders over $50! 🎉\n• International shipping available\n\nShipping costs calculated at checkout based on your location.";
  }
  
  // Return related
  if (message.includes('return') || message.includes('exchange') || message.includes('refund')) {
    return "Return Policy (30 Days):\n• Items must be unworn with original tags\n• Free returns for defective/damaged items\n• Full refund or store credit available\n• Easy return process through your account\n\nStart a return from your order history or contact us for assistance!";
  }
  
  // Sizing related
  if (message.includes('size') || message.includes('fit') || message.includes('measurement') || message.includes('measure')) {
    return "Size Guide (Chest measurements):\n• S: 34-36 inches\n• M: 38-40 inches\n• L: 42-44 inches\n• XL: 46-48 inches\n• XXL: 50-52 inches\n\nRegular fit style. Between sizes? We recommend sizing up for comfort!";
  }
  
  // Payment related
  if (message.includes('payment') || message.includes('pay') || message.includes('card') || message.includes('price') || message.includes('cost')) {
    return "Payment Methods Accepted:\n• Credit/Debit Cards (Visa, Mastercard, Amex)\n• PayPal\n• Apple Pay\n• Google Pay\n• Buy Now, Pay Later options\n\n🔒 All transactions are secure and encrypted. Prices include taxes unless noted.";
  }
  
  // Contact related
  if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('reach')) {
    return "Contact Customer Support:\n• Live Chat: 24/7 (that's me! 💬)\n• Email: support@ownwear.com\n• Phone: 1-800-TSHIRT\n• Response Time: Within 24 hours\n\nI'm here right now to help with your questions!";
  }
  
  // Account related
  if (message.includes('account') || message.includes('login') || message.includes('password') || message.includes('sign')) {
    return "Account Help:\n• Forgot Password? Use the 'Forgot Password' link on login page\n• Update profile in account settings\n• View order history in your dashboard\n• Manage shipping addresses\n\nStill having trouble? Let me know what specific issue you're facing!";
  }
  
  // Quality/Material
  if (message.includes('quality') || message.includes('material') || message.includes('fabric') || message.includes('cotton')) {
    return "Our Quality Promise:\n• Premium 100% cotton and cotton blends\n• Pre-shrunk fabric\n• Durable stitching\n• Colorfast printing\n• Soft, breathable, and comfortable\n\nWe stand behind our quality with a satisfaction guarantee!";
  }
  
  // Discount/Coupon
  if (message.includes('discount') || message.includes('coupon') || message.includes('promo') || message.includes('sale') || message.includes('offer')) {
    return "Current Offers:\n• FREE shipping on orders over $50\n• Sign up for newsletter: Get 10% off first order\n• Seasonal sales announced via email\n• Follow us on social media for exclusive deals\n\nCheck the home page for current promotions!";
  }
  
  // Availability/Stock
  if (message.includes('available') || message.includes('stock') || message.includes('out of stock') || message.includes('sold out')) {
    return "Product Availability:\n• Stock status shown on each product page\n• New inventory restocked weekly\n• Sign up for restock notifications\n• Popular items sell fast!\n\nLooking for something specific? Let me know and I'll check!";
  }
  
  // Customization
  if (message.includes('custom') || message.includes('design') || message.includes('print') || message.includes('personalize')) {
    return "Custom T-Shirts:\n• Custom designs available\n• Upload your own artwork\n• Bulk orders for events/teams\n• Contact us for custom quotes\n\nInterested in customization? Reach out to our team for details!";
  }
  
  // Care Instructions
  if (message.includes('wash') || message.includes('care') || message.includes('clean') || message.includes('maintain')) {
    return "Care Instructions:\n• Machine wash cold with like colors\n• Tumble dry low or hang dry\n• Do not bleach\n• Iron inside out if needed\n• Avoid dry cleaning\n\nProper care keeps your T-shirts looking great for years!";
  }
  
  // Colors
  if (message.includes('color') || message.includes('colour')) {
    return "Available Colors:\n• Classic: Black, White, Gray\n• Bold: Red, Blue, Green, Yellow\n• Pastels: Pink, Lavender, Mint\n• And many more!\n\nColor options vary by design. Check individual product pages for available colors!";
  }
  
  // Warranty/Guarantee
  if (message.includes('warranty') || message.includes('guarantee') || message.includes('defect')) {
    return "Our Guarantee:\n• 30-day satisfaction guarantee\n• Free replacement for defective items\n• Quality assurance on all products\n• Hassle-free return process\n\nNot satisfied? We'll make it right!";
  }
  
  // Hours/Timing
  if (message.includes('hour') || message.includes('time') || message.includes('when') || message.includes('open')) {
    return "We're Here For You:\n• Online Store: Open 24/7\n• Live Chat Support: 24/7 (that's me!)\n• Email Support: Responses within 24 hours\n• Phone Support: Mon-Fri, 9 AM - 6 PM EST\n\nShop anytime, anywhere!";
  }
  
  // Location/Store
  if (message.includes('location') || message.includes('store') || message.includes('address') || message.includes('where')) {
    return "We're Online Only:\n• No physical store locations\n• Shop from anywhere, anytime\n• Worldwide shipping available\n• Fast delivery to your doorstep\n\nEnjoy the convenience of online shopping!";
  }
  
  // Default response
  return "Thanks for reaching out! I'm here to help with any questions about our T-shirts, orders, shipping, returns, or anything else. Could you please tell me more about what you need? I'll do my best to assist you! 😊";
};

// Chat with support
const chatWithSupport = asyncHandler(async (req, res) => {
  try {
    console.log("✅ Received support chat request");
    const { prompt } = req.body;

    if (!prompt) {
      console.log("❌ No message provided");
      return res.status(400).json({
        success: false,
        message: "Please provide a message"
      });
    }

    console.log(`📝 User message: ${prompt.substring(0, 100)}...`);
    
    // Generate support response
    const responseText = getSupportResponse(prompt);
    
    console.log("➡️ Sending support response");
    console.log(`📤 Response: ${responseText.substring(0, 100)}...`);
    
    res.status(200).json({
      success: true,
      message: responseText,
      isSupport: true
    });
  } catch (error) {
    console.error("🔥 Support Chat Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error processing your request. Please try again.",
    });
  }
});

module.exports = {
  chatWithSupport,
};
