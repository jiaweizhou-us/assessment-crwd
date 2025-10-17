// Vercel serverless function handler
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('../backend/routes/auth');
const payoutRoutes = require('../backend/routes/payouts');
const opsRoutes = require('../backend/routes/ops');
const payoutGuardRoutes = require('../backend/routes/payoutGuard');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-vercel-2024';

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    'https://crwd-platform.vercel.app', // Replace with your actual domain
    'https://*.vercel.app'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Central token verification middleware
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

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/payouts', verifyToken, payoutRoutes);
app.use('/api/ops', verifyToken, verifyAdmin, opsRoutes);
app.use('/api', verifyToken, payoutGuardRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CRWD Backend API is running on Vercel',
    version: '2.0.0',
    environment: 'production',
    endpoints: {
      auth: '/api/auth',
      payouts: '/api/payouts',
      operations: '/api/ops',
      refund_check: '/api/check-refund-status'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Export as a serverless function handler
module.exports = (req, res) => {
  return app(req, res);
};