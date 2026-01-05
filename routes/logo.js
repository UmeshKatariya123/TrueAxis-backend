const express = require('express');
const { body, validationResult } = require('express-validator');
const Logo = require('../models/Logo');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all logos (public route)
router.get('/', async (req, res) => {
  try {
    const logos = await Logo.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(logos);
  } catch (error) {
    console.error('Get logos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get logo by name (public route)
router.get('/:name', async (req, res) => {
  try {
    const logo = await Logo.findOne({
      name: req.params.name,
      isActive: true
    });
    
    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }
    
    res.json(logo);
  } catch (error) {
    console.error('Get logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get logo by variant (public route)
router.get('/variant/:variant', async (req, res) => {
  try {
    const logo = await Logo.findOne({
      variant: req.params.variant,
      isActive: true
    });
    
    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }
    
    res.json(logo);
  } catch (error) {
    console.error('Get logo by variant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes - require authentication
router.use(adminAuth);

// Get all logos (admin)
router.get('/admin/all', async (req, res) => {
  try {
    const logos = await Logo.find().sort({ createdAt: -1 });
    res.json(logos);
  } catch (error) {
    console.error('Get all logos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create logo (admin)
router.post('/', [
  body('name').isIn(['logo-light', 'logo-dark', 'logo-main']).withMessage('Invalid logo name'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('imageData').notEmpty().withMessage('Image data is required'),
  body('variant').isIn(['light', 'dark', 'main']).withMessage('Invalid variant')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if logo with same name exists
    const existingLogo = await Logo.findOne({ name: req.body.name });
    if (existingLogo) {
      return res.status(400).json({ message: 'Logo with this name already exists' });
    }

    const logo = new Logo(req.body);
    await logo.save();
    res.status(201).json(logo);
  } catch (error) {
    console.error('Create logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update logo (admin)
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('imageData').optional().notEmpty().withMessage('Image data cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const logo = await Logo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    res.json(logo);
  } catch (error) {
    console.error('Update logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete logo (admin)
router.delete('/:id', async (req, res) => {
  try {
    const logo = await Logo.findByIdAndDelete(req.params.id);
    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }
    res.json({ message: 'Logo deleted successfully' });
  } catch (error) {
    console.error('Delete logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

