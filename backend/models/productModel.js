const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  restaurantName: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
