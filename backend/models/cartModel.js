const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;