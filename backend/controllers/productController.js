const ProductModel = require('../models/productModel'); // Adjust path if necessary
const { uploadOnCloudinary } = require('../utils/cloudinary'); // Adjust path if necessary

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const { productName, price, description, category, restaurantName } = req.body;

    // Validate required fields
    if (!productName || !price || !description || !category || !restaurantName || !req.file) {
      return res.status(400).json({ message: "All fields, including the image, are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded." });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    if (!uploadedImage) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
    }

    // Create and save the product in the database
    const newProduct = new ProductModel({
      productName,
      price,
      description,
      category,
      restaurantName,
      imageUrl: uploadedImage.secure_url,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created successfully.", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Failed to create product.", error: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const { _id } = req.params;
  console.log('Deleting product with ID:', _id);
  try {
    const product = await ProductModel.findByIdAndDelete(_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
