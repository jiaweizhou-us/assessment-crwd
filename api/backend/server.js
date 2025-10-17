const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authRoutes = require('./routes/auth');
const payoutRoutes = require('./routes/payouts');
const opsRoutes = require('./routes/ops');
const payoutGuardRoutes = require('./routes/payoutGuard');
const { users, transactions, reviews, payouts } = require('./mockData');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// CORS configuration for both development and production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://crwd-platform.vercel.app', // Replace with your actual Vercel URL
        'https://your-frontend-url.vercel.app' // Add your actual frontend URL here
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Central token verification middleware used for protected endpoints
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
}

// Admin-only middleware
function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
}

// Mount auth routes (public)
app.use('/api/auth', authRoutes);

// Mount protected routes
app.use('/api/payouts', verifyToken, payoutRoutes);
app.use('/api/ops', verifyToken, verifyAdmin, opsRoutes);
app.use('/api', verifyToken, payoutGuardRoutes);

// Admin endpoints - Add these BEFORE module.exports
// Get all transactions (admin only)
app.get('/api/admin/transactions', verifyToken, verifyAdmin, (req, res) => {
    // Sort transactions by purchase date (newest first)
    const sortedTransactions = transactions.sort((a, b) => 
        new Date(b.purchase_date) - new Date(a.purchase_date)
    );
    
    res.json(sortedTransactions);
});

// Get all users (admin only)
app.get('/api/admin/users', verifyToken, verifyAdmin, (req, res) => {
    // Remove passwords from response
    const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
    });
    
    res.json(safeUsers);
});

// Get all reviews (admin only)
app.get('/api/admin/reviews', verifyToken, verifyAdmin, (req, res) => {
    res.json(reviews);
});

// Get all payouts (admin only)
app.get('/api/admin/payouts', verifyToken, verifyAdmin, (req, res) => {
    res.json(payouts);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CRWD Backend API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      payouts: '/api/payouts',
      operations: '/api/ops',
      refund_check: '/api/check-refund-status'
    }
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to CRWD API',
    version: '2.0.0',
    documentation: 'https://github.com/your-repo/crwd-platform',
    endpoints: {
      auth: '/api/auth',
      payouts: '/api/payouts',
      operations: '/api/ops',
      health: '/api/health'
    }
  });
});

// Catch-all for API routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'CRWD Platform API',
    version: '2.0.0',
    status: 'running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Only start server in development mode
// In production (Vercel), this will be handled by the serverless function
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 CRWD Backend Server running on http://localhost:${port}`);
    console.log(`📊 Admin Dashboard: http://localhost:3000/admin-dashboard`);
    console.log(`💰 Payouts Management: http://localhost:3000/payout-list`);
  });
}

// Export the Express app for Vercel serverless functions
module.exports = app;