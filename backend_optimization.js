// Backend optimization script for Studify.in
// This script implements performance optimizations for the Node.js/Express backend

/**
 * Backend Optimization Implementation
 */

// Import required modules
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');

/**
 * Apply optimizations to Express app
 * @param {Object} app - Express app instance
 */
function applyOptimizations(app) {
  // Security optimizations
  app.use(helmet()); // Set security HTTP headers
  app.use(xss()); // Prevent XSS attacks
  app.use(mongoSanitize()); // Prevent NoSQL injection
  app.use(hpp()); // Prevent HTTP parameter pollution
  
  // Performance optimizations
  app.use(compression()); // Compress responses
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });
  app.use('/api/', limiter);
  
  // CORS configuration
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://studify.in' 
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  };
  app.use(cors(corsOptions));
  
  // Logging in development
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  
  return app;
}

/**
 * Database optimization configurations
 */
const dbOptimizations = {
  // MongoDB connection options for optimization
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  },
  
  // Index creation for common queries
  createIndexes: async (mongoose) => {
    // Example: Create indexes for User model
    const User = mongoose.model('User');
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    
    // Example: Create indexes for Tool model
    const Tool = mongoose.model('Tool');
    await Tool.collection.createIndex({ name: 1 });
    await Tool.collection.createIndex({ category: 1 });
    await Tool.collection.createIndex({ rating: -1 });
    
    // Example: Create indexes for Tutorial model
    const Tutorial = mongoose.model('Tutorial');
    await Tutorial.collection.createIndex({ title: 1 });
    await Tutorial.collection.createIndex({ category: 1 });
    await Tutorial.collection.createIndex({ difficulty: 1 });
    
    // Example: Create indexes for Productivity model
    const Productivity = mongoose.model('Productivity');
    await Productivity.collection.createIndex({ title: 1 });
    await Productivity.collection.createIndex({ category: 1 });
    await Productivity.collection.createIndex({ impact: 1 });
    
    // Example: Create text indexes for search
    await Tool.collection.createIndex({ name: 'text', description: 'text' });
    await Tutorial.collection.createIndex({ title: 'text', content: 'text' });
    await Productivity.collection.createIndex({ title: 'text', content: 'text' });
    
    console.log('Database indexes created successfully');
  }
};

/**
 * Caching implementation
 */
const cacheImplementation = {
  // Redis cache configuration
  redisConfig: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    ttl: 60 * 60 * 24 // Cache for 24 hours
  },
  
  // Example middleware for route caching with Redis
  cacheMiddleware: (redisClient) => {
    return async (req, res, next) => {
      // Skip caching for non-GET requests
      if (req.method !== 'GET') {
        return next();
      }
      
      const cacheKey = `studify:${req.originalUrl}`;
      
      try {
        const cachedData = await redisClient.get(cacheKey);
        
        if (cachedData) {
          // Return cached data
          return res.status(200).json(JSON.parse(cachedData));
        }
        
        // Store original send function
        const originalSend = res.send;
        
        // Override send function to cache response
        res.send = function(body) {
          // Cache the response
          redisClient.set(
            cacheKey,
            typeof body === 'string' ? body : JSON.stringify(body),
            'EX',
            60 * 60 // Cache for 1 hour
          );
          
          // Call original send function
          originalSend.call(this, body);
        };
        
        next();
      } catch (error) {
        console.error('Cache error:', error);
        next();
      }
    };
  }
};

/**
 * Error handling optimization
 */
const errorHandlingOptimization = {
  // Global error handler
  globalErrorHandler: (err, req, res, next) => {
    // Log error for debugging
    console.error(err.stack);
    
    // Set default error values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    // Different response in development vs production
    if (process.env.NODE_ENV === 'development') {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
    } else {
      // Production: don't leak error details
      if (err.isOperational) {
        // Operational, trusted error: send message to client
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });
      } else {
        // Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong'
        });
      }
    }
  },
  
  // Custom error class for operational errors
  AppError: class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// Optimization guide for backend
const optimizationGuide = `
# Backend Optimization Guide for Studify.in

## Security Optimizations

### 1. Implement Security Headers with Helmet

\`\`\`js
const helmet = require('helmet');
app.use(helmet());
\`\`\`

### 2. Prevent XSS Attacks

\`\`\`js
const xss = require('xss-clean');
app.use(xss());
\`\`\`

### 3. Prevent NoSQL Injection

\`\`\`js
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
\`\`\`

### 4. Implement Rate Limiting

\`\`\`js
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);
\`\`\`

## Performance Optimizations

### 1. Implement Response Compression

\`\`\`js
const compression = require('compression');
app.use(compression());
\`\`\`

### 2. Optimize MongoDB Queries

- Create indexes for frequently queried fields
- Use projection to limit returned fields
- Use pagination for large result sets

\`\`\`js
// Create indexes
await User.collection.createIndex({ email: 1 }, { unique: true });

// Use projection and pagination
const users = await User.find({})
  .select('name email') // Only return name and email
  .skip(page * limit)
  .limit(limit);
\`\`\`

### 3. Implement Caching with Redis

\`\`\`js
const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Cache middleware
const cacheMiddleware = async (req, res, next) => {
  if (req.method !== 'GET') return next();
  
  const cacheKey = \`studify:\${req.originalUrl}\`;
  
  try {
    const cachedData = await getAsync(cacheKey);
    
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    
    res.sendResponse = res.send;
    res.send = (body) => {
      setAsync(cacheKey, typeof body === 'string' ? body : JSON.stringify(body), 'EX', 3600);
      res.sendResponse(body);
    };
    
    next();
  } catch (error) {
    next();
  }
};

// Apply to routes that benefit from caching
app.get('/api/tools', cacheMiddleware, toolController.getAllTools);
\`\`\`

## Error Handling Optimizations

### 1. Implement Global Error Handler

\`\`\`js
// errorController.js
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};

// app.js
app.use(globalErrorHandler);
\`\`\`

### 2. Create Custom Error Class

\`\`\`js
// appError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

// Usage
if (!user) {
  return next(new AppError('User not found', 404));
}
\`\`\`

## Logging Optimizations

### 1. Implement Structured Logging

\`\`\`js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Usage
logger.info('Server started on port 5000');
logger.error('Database connection failed', { error: err });
\`\`\`

## API Optimization

### 1. Implement Pagination

\`\`\`js
// controllers/toolController.js
exports.getAllTools = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  const tools = await Tool.find()
    .skip(skip)
    .limit(limit);
  
  const total = await Tool.countDocuments();
  
  res.status(200).json({
    status: 'success',
    results: tools.length,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    data: {
      tools
    }
  });
};
\`\`\`

### 2. Implement Field Limiting

\`\`\`js
// controllers/toolController.js
exports.getAllTools = async (req, res, next) => {
  // Allow clients to request only specific fields
  let fields = '';
  if (req.query.fields) {
    fields = req.query.fields.split(',').join(' ');
  }
  
  const tools = await Tool.find()
    .select(fields);
  
  res.status(200).json({
    status: 'success',
    results: tools.length,
    data: {
      tools
    }
  });
};
\`\`\`

### 3. Implement Filtering

\`\`\`js
// controllers/toolController.js
exports.getAllTools = async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(field => delete queryObj[field]);
  
  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\\b(gte|gt|lte|lt)\\b/g, match => \`$\${match}\`);
  
  const query = Tool.find(JSON.parse(queryStr));
  
  // Execute query
  const tools = await query;
  
  res.status(200).json({
    status: 'success',
    results: tools.length,
    data: {
      tools
    }
  });
};
\`\`\`
`;

// Export the optimizations
module.exports = {
  applyOptimizations,
  dbOptimizations,
  cacheImplementation,
  errorHandlingOptimization,
  optimizationGuide
};
