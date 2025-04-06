const Productivity = require('../models/productivityModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all productivity hacks
// @route   GET /api/productivity
// @access  Public
exports.getProductivityHacks = asyncHandler(async (req, res, next) => {
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
  let query = Productivity.find(JSON.parse(queryStr));

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
  const total = await Productivity.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const productivityHacks = await query;

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
    count: productivityHacks.length,
    pagination,
    data: productivityHacks
  });
});

// @desc    Get single productivity hack
// @route   GET /api/productivity/:id
// @access  Public
exports.getProductivityHack = asyncHandler(async (req, res, next) => {
  const productivityHack = await Productivity.findById(req.params.id);

  if (!productivityHack) {
    return next(
      new ErrorResponse(`Productivity hack not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: productivityHack
  });
});

// @desc    Get productivity hack by slug
// @route   GET /api/productivity/slug/:slug
// @access  Public
exports.getProductivityHackBySlug = asyncHandler(async (req, res, next) => {
  const productivityHack = await Productivity.findOne({ slug: req.params.slug });

  if (!productivityHack) {
    return next(
      new ErrorResponse(`Productivity hack not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Increment views
  productivityHack.views = (productivityHack.views || 0) + 1;
  await productivityHack.save();

  res.status(200).json({
    success: true,
    data: productivityHack
  });
});

// @desc    Create new productivity hack
// @route   POST /api/productivity
// @access  Private
exports.createProductivityHack = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id;
  req.body.authorName = req.user.name;

  const productivityHack = await Productivity.create(req.body);

  res.status(201).json({
    success: true,
    data: productivityHack
  });
});

// @desc    Update productivity hack
// @route   PUT /api/productivity/:id
// @access  Private
exports.updateProductivityHack = asyncHandler(async (req, res, next) => {
  let productivityHack = await Productivity.findById(req.params.id);

  if (!productivityHack) {
    return next(
      new ErrorResponse(`Productivity hack not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is productivity hack owner or admin
  if (productivityHack.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this productivity hack`,
        401
      )
    );
  }

  productivityHack = await Productivity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: productivityHack
  });
});

// @desc    Delete productivity hack
// @route   DELETE /api/productivity/:id
// @access  Private
exports.deleteProductivityHack = asyncHandler(async (req, res, next) => {
  const productivityHack = await Productivity.findById(req.params.id);

  if (!productivityHack) {
    return next(
      new ErrorResponse(`Productivity hack not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is productivity hack owner or admin
  if (productivityHack.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this productivity hack`,
        401
      )
    );
  }

  await productivityHack.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add comment to productivity hack
// @route   POST /api/productivity/:id/comments
// @access  Private
exports.addProductivityComment = asyncHandler(async (req, res, next) => {
  const productivityHack = await Productivity.findById(req.params.id);

  if (!productivityHack) {
    return next(
      new ErrorResponse(`Productivity hack not found with id of ${req.params.id}`, 404)
    );
  }

  const comment = {
    user: req.user.id,
    userName: req.user.name,
    comment: req.body.comment
  };

  productivityHack.comments.push(comment);
  await productivityHack.save();

  res.status(201).json({
    success: true,
    data: productivityHack
  });
});

// @desc    Get featured productivity hacks
// @route   GET /api/productivity/featured
// @access  Public
exports.getFeaturedProductivityHacks = asyncHandler(async (req, res, next) => {
  const productivityHacks = await Productivity.find({ isFeatured: true }).limit(6);

  res.status(200).json({
    success: true,
    count: productivityHacks.length,
    data: productivityHacks
  });
});

// @desc    Get productivity hacks by category
// @route   GET /api/productivity/category/:category
// @access  Public
exports.getProductivityHacksByCategory = asyncHandler(async (req, res, next) => {
  const productivityHacks = await Productivity.find({ category: req.params.category });

  res.status(200).json({
    success: true,
    count: productivityHacks.length,
    data: productivityHacks
  });
});

// @desc    Like productivity hack
// @route   PUT /api/productivity/:id/like
// @access  Private
exports.likeProductivityHack = asyncHandler(async (req, res, next) => {
  const productivityHack = await Productivity.findById(req.params.id);

  if (!productivityHack) {
    return next(
      new ErrorResponse(`Productivity hack not found with id of ${req.params.id}`, 404)
    );
  }

  productivityHack.likes = (productivityHack.likes || 0) + 1;
  await productivityHack.save();

  res.status(200).json({
    success: true,
    data: productivityHack
  });
});
