const mongoose = require('mongoose');
const Order = require('../models/orderModel');

const placeOrder = async (req, res) => {
  try {
    const { productId, productName, productPrice, userDetails, productImage } = req.body;

    const newOrder = new Order({
      productId,
      productName,
      productPrice,
      userDetails,
      productImage,
      status: 'Pending',
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

// Fetch orders by productId (which is an ObjectId)


// Fetch all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

module.exports = {
  placeOrder,
  
  getAllOrders,  // Added the function to fetch all orders
};
