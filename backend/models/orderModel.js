const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  productPrice: { 
    type: Number, 
    required: true 
  },
  userDetails: {
    name: { 
      type: String, 
      required: true 
    },
    address: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  productImage: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    default: 'Pending' 
  },
});

// Define and export the Order model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
