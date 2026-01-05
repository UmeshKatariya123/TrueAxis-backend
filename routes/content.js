const express = require('express');
const Content = require('../models/Content');

const router = express.Router();

// Get all active content (public route)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    const content = await Content.find(query).sort({ order: 1, createdAt: -1 });
    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get content by category
router.get('/category/:category', async (req, res) => {
  try {
    const content = await Content.find({
      category: req.params.category,
      isActive: true
    }).sort({ order: 1, createdAt: -1 });
    
    res.json(content);
  } catch (error) {
    console.error('Get content by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single content (public route)
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      isActive: true
    });
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

