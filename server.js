const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Configuration - Allow all Netlify domains (production and preview)
const allowedOrigins = [
  'https://trueaxisitsolustion.netlify.app',
  /^https:\/\/.*--trueaxisitsolustion\.netlify\.app$/, // All preview deployments
  /^https:\/\/.*\.netlify\.app$/, // Any Netlify app
  'http://localhost:3000', // Local development
  'http://localhost:3001'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/content', require('./routes/content'));
app.use('/api/logo', require('./routes/logo'));
app.use('/api/contact', require('./routes/contact'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://umeshkatariya648:W7dFiGItomnXpj9K@onecrud.trkpzf9.mongodb.net/trueaxis?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'TrueAxis IT Solution API is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TrueAxis IT Solution API',
    status: 'running',
    endpoints: {
      health: '/health',
      contact: '/api/contact',
      content: '/api/content',
      logo: '/api/logo',
      auth: '/api/auth'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.path,
    availableRoutes: [
      'GET /',
      'POST /api/contact',
      'GET /api/contact/test',
      'GET /api/content',
      'GET /api/logo'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

