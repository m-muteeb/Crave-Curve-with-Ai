const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the item is already in the cart
    const existingCartItem = await Cart.findOne({ productId });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({ message: 'Cart updated successfully', cart: existingCartItem });
    }

    // Add new item to the cart
    const newCartItem = new Cart({ productId, quantity });
    await newCartItem.save();
    res.status(201).json({ message: 'Item added to cart successfully', cart: newCartItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
};

// Get cart items
const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find().populate('productId');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cartItem = await Cart.findOneAndDelete({ productId });
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
};
