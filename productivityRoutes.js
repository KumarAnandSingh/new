const express = require('express');
const router = express.Router();
const {
  getProductivityHacks,
  getProductivityHack,
  getProductivityHackBySlug,
  createProductivityHack,
  updateProductivityHack,
  deleteProductivityHack,
  addProductivityComment,
  getFeaturedProductivityHacks,
  getProductivityHacksByCategory,
  likeProductivityHack
} = require('../controllers/productivityController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProductivityHacks);
router.get('/featured', getFeaturedProductivityHacks);
router.get('/category/:category', getProductivityHacksByCategory);
router.get('/:id', getProductivityHack);
router.get('/slug/:slug', getProductivityHackBySlug);

// Protected routes
router.post('/', protect, createProductivityHack);
router.put('/:id', protect, updateProductivityHack);
router.delete('/:id', protect, deleteProductivityHack);
router.post('/:id/comments', protect, addProductivityComment);
router.put('/:id/like', protect, likeProductivityHack);

module.exports = router;
