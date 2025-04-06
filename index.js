require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// Import routes
const userRoutes = require('./routes/userRoutes');
const toolRoutes = require('./routes/toolRoutes');
const tutorialRoutes = require('./routes/tutorialRoutes');
const productivityRoutes = require('./routes/productivityRoutes');
const communityRoutes = require('./routes/communityRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://studify.in' 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/community', communityRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studify', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; // For testing purposes
