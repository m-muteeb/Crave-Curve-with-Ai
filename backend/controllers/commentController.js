const Comment = require('../models/commentModel');

// Get comments by product ID
const getCommentsByProductId = async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// Add a new comment
const addComment = async (req, res) => {
  try {
    const { productId, text } = req.body;
    const newComment = new Comment({ productId, text });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

module.exports = {
  getCommentsByProductId,
  addComment,
};