const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { adminAuth } = require('../middleware/auth');

// @route   GET /api/contact/test
// @desc    Test endpoint to verify contact route is working
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Contact API is working!', timestamp: new Date().toISOString() });
});

// @route   POST /api/contact
// @desc    Submit a contact form (public)
// @access  Public
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  async (req, res) => {
    try {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, company, message } = req.body;

      const contact = new Contact({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        company: company ? company.trim() : '',
        message: message.trim(),
        status: 'new'
      });

      await contact.save();
      
      res.status(201).json({ 
        message: 'Thank you for your message! We will get back to you soon.',
        contactId: contact._id 
      });
    } catch (error) {
      console.error('Contact submission error:', error);
      console.error('Error stack:', error.stack);
      
      // Check if it's a MongoDB connection error
      if (error.name === 'MongoServerError' || error.message.includes('Mongo')) {
        return res.status(500).json({ 
          message: 'Database connection error. Please contact the administrator.',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      
      // Check if it's a validation error
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Validation error',
          errors: Object.values(error.errors).map(e => ({ msg: e.message }))
        });
      }
      
      res.status(500).json({ 
        message: 'Server error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// @route   GET /api/contact/admin/all
// @desc    Get all contact submissions (admin only)
// @access  Private (Admin)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/contact/admin/:id
// @desc    Get a single contact submission (admin only)
// @access  Private (Admin)
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/contact/admin/:id/status
// @desc    Update contact status (admin only)
// @access  Private (Admin)
router.put('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/contact/admin/:id
// @desc    Delete a contact submission (admin only)
// @access  Private (Admin)
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await Contact.deleteOne({ _id: req.params.id });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

