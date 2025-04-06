const mongoose = require('mongoose');

const productivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a productivity hack title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide detailed content']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Time Management', 'Focus', 'Study Techniques', 'Organization', 'Motivation', 'Other']
  },
  impact: {
    type: String,
    required: [true, 'Please provide impact level'],
    enum: ['Low', 'Medium', 'High']
  },
  difficulty: {
    type: String,
    required: [true, 'Please provide difficulty level'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    default: 'default-productivity.jpg'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  steps: {
    type: [String],
    default: []
  },
  tips: {
    type: [String],
    default: []
  },
  resources: {
    type: [
      {
        title: String,
        url: String,
        description: String
      }
    ],
    default: []
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      userName: {
        type: String,
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

// Create slug from title before saving
productivitySchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    next();
    return;
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  next();
});

// Update the updatedAt field on save
productivitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Productivity', productivitySchema);
