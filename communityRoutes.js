const express = require('express');
const router = express.Router();
const {
  getDiscussions,
  getDiscussion,
  getDiscussionBySlug,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addDiscussionReply,
  likeDiscussion,
  likeReply,
  getDiscussionsByCategory,
  pinDiscussion,
  lockDiscussion
} = require('../controllers/discussionController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/discussions', getDiscussions);
router.get('/discussions/category/:category', getDiscussionsByCategory);
router.get('/discussions/:id', getDiscussion);
router.get('/discussions/slug/:slug', getDiscussionBySlug);

// Protected routes
router.post('/discussions', protect, createDiscussion);
router.put('/discussions/:id', protect, updateDiscussion);
router.delete('/discussions/:id', protect, deleteDiscussion);
router.post('/discussions/:id/replies', protect, addDiscussionReply);
router.put('/discussions/:id/like', protect, likeDiscussion);
router.put('/discussions/:id/replies/:replyId/like', protect, likeReply);

// Admin/Moderator routes
router.put(
  '/discussions/:id/pin',
  protect,
  authorize('admin', 'moderator'),
  pinDiscussion
);
router.put(
  '/discussions/:id/lock',
  protect,
  authorize('admin', 'moderator'),
  lockDiscussion
);

module.exports = router;
