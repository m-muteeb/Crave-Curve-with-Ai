const express = require("express");
const routers = express.Router();
const { register, login } = require("../controllers/authController");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { uploadedImage } = require("../middleware/multer");
const { placeOrder, getAllOrders } = require("../controllers/orderController");
const { addToCart, getCartItems, removeFromCart } = require("../controllers/cartController");
const { getCommentsByProductId, addComment } = require('../controllers/commentController');

// Authentication routes
routers.post("/register", register);
routers.post("/login", login);

// Product routes
routers.post('/createProducts', uploadedImage.single('image'), createProduct);
routers.get('/readProducts', getAllProducts);
routers.get('/Products/:id', getProductById);
routers.put('/updateProducts/:id', updateProduct);
routers.delete('/deleteProducts/:_id', deleteProduct);

// Order routes
routers.post('/orders', placeOrder);
routers.get('/orders', getAllOrders);

// Cart routes
routers.post('/cart', addToCart);
routers.get('/cart', getCartItems);
routers.delete('/cart/:id', removeFromCart);

// Comment routes
routers.get('/products/:productId/comments', getCommentsByProductId);
routers.post('/products/:productId/comments', addComment);

module.exports = routers;