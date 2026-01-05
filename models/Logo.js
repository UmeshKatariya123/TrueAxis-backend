const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    enum: ['logo-light', 'logo-dark', 'logo-main']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  // Store image as base64 string or URL path
  imageData: {
    type: String,
    required: true
  },
  // Image type: 'base64' or 'url'
  imageType: {
    type: String,
    enum: ['base64', 'url'],
    default: 'url'
  },
  // Image format: 'png', 'svg', 'jpg', etc.
  imageFormat: {
    type: String,
    default: 'png'
  },
  // Variant: 'light' for light backgrounds, 'dark' for dark backgrounds
  variant: {
    type: String,
    enum: ['light', 'dark', 'main'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Logo', logoSchema);

