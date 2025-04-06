const Discussion = require('../models/discussionModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all discussions
// @route   GET /api/community/discussions
// @access  Public
exports.getDiscussions = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Discussion.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Discussion.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const discussions = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: discussions.length,
    pagination,
    data: discussions
  });
});

// @desc    Get single discussion
// @route   GET /api/community/discussions/:id
// @access  Public
exports.getDiscussion = asyncHandler(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    return next(
      new ErrorResponse(`Discussion not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment views
  discussion.views = (discussion.views || 0) + 1;
  await discussion.save();

  res.status(200).json({
    success: true,
    data: discussion
  });
});

// @desc    Get discussion by slug
// @route   GET /api/community/discussions/slug/:slug
// @access  Public
exports.getDiscussionBySlug = asyncHandler(async (req, res, next) => {
  const discussion = await Discussion.findOne({ slug: req.params.slug });

  if (!discussion) {
    return next(
      new ErrorResponse(`Discussion not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Increment views
  discussion.views = (discussion.views || 0) + 1;
  await discussion.save();

  res.status(200).json({
    success: true,
    data: discussion
  });
});

// @desc    Create new discussion
// @route   POST /api/community/discussions
// @access  Private
exports.createDiscussion = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id;
  req.body.authorName = req.user.name;

  const discussion = await Discussion.create(req.body);

  res.status(201).json({
    success: true,
    data: discussion
  });
});

// @desc    Update discussion
// @route   PUT /api/community/discussions/:id
// @access  Private
exports.updateDiscussion = asyncHandler(async (req, res, next) => {
  let discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    return next(
      new ErrorResponse(`Discussion not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is discussion owner or admin/moderator
  if (
    discussion.author.toString() !== req.user.id && 
    req.user.role !== 'admin' && 
    req.user.role !== 'moderator'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this discussion`,
        401
      )
    );
  }

  discussion = await Discussion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: discussion
  });
});

// @desc    Delete discussion
// @route   DELETE /api/community/discussions/:id
// @access  Private
exports.deleteDiscussion = asyncHandler(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    return next(
      new ErrorResponse(`Discussion not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is discussion owner or admin/moderator
  if (
    discussion.author.toString() !== req.user.id && 
    req.user.role !== 'admin' && 
    req.user.role !== 'moderator'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this discussion`,
        401
      )
    );
  }

  await discussion.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add reply to discussion
// @route   POST /api/community/discussions/:id/replies
// @access  Private
exports.addDiscussionReply = asyncHandler(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    return next(
      new ErrorResponse(`Discussion not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if discussion is locked
  if (discussion.isLocked) {
    return next(
      new ErrorResponse('This discussion is locked and cannot receive new replies', 400)
    );
  }

  const reply = {
    user: req.user.id,
    userName: req.user.name,
    content: req.body.content
  };

  discussion.replies.push(reply);
  await discussion.save();

  res.status(201).json({
    success: true,
    data: discussion
  });
});

// @desc    Like discussion
// @route   PUT /api/community/discussions/:id/like
// @access  Private
exports.likeDiscussion = asyncHandler(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    return next(
      new ErrorResponse(`Discussion not found with id of ${req.params.id}`, 404)
    );
  }

  discussion.likes = (discussion.likes || 0) + 1;
  await discussion.save();

  res.status(200).json({
    success: true,
    data: discussion
  });
});

// @desc    Like reply
// @route   PUT /api/community/discussions/:id/replies/:replyId/like
// @access  Private
exports.likeReply = asyncHandler(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    return next(
      new ErrorResponse(`Discussion not found with id of ${req.params.id}`, 404)
    );
  }

  // Find the reply
  const reply = discussion.replies.id(req.params.replyId);

  if (!reply) {
    return next(
      new ErrorResponse(`Reply not found with id of ${req.params.replyId}`, 404)
    );
  }

  reply.likes = (reply.likes || 0) + 1;
  await discussion.save();

  res.status(200).json({
    success: true,
    data: discussion
  });
});

// @desc    Get discussions by category
// @route   GET /api/community/discussions/category/:category
// @access  Public
exports.getDiscussionsByCategory = asyncHandler(async (req, res, next) => {
  const discussions = await Discussion.find({ category: req.params.category });

  res.status(200).json({
    success: true,
    count: discussions.length,
    data: discussions
  });
});

// @desc    Pin/unpin discussion
// @route   PUT /api/community/discussions/:id/pin
// @access  Private (Admin/Moderator)
exports.pinDiscussion = asyncHandler(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    return next(
      new ErrorResponse(`Discussion not found with id of ${req.params.id}`, 404)
    );
  }

  // Only admin or moderator can pin/unpin
  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to pin/unpin discussions`,
        401
      )
    );
  }

  discussion.isPinned = !discussion.isPinned;
  await discussion.save();

  res.status(200).json({
    success: true,
    data: discussion
  });
});

// @desc    Lock/unlock discussion
// @route   PUT /api/community/discussions/:id/lock
// @access  Private (Admin/Moderator)
exports.lockDiscussion = asyncHandler(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    return next(
      new ErrorResponse(`Discussion not found with id of ${req.params.id}`, 404)
    );
  }

  // Only admin or moderator can lock/unlock
  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to lock/unlock discussions`,
        401
      )
    );
  }

  discussion.isLocked = !discussion.isLocked;
  await discussion.save();

  res.status(200).json({
    success: true,
    data: discussion
  });
});
