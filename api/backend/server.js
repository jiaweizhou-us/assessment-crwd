const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authRoutes = require('./routes/auth');
const payoutRoutes = require('./routes/payouts');
const opsRoutes = require('./routes/ops');
const payoutGuardRoutes = require('./routes/payoutGuard');
const { users, transactions } = require('./mockData');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow React dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Mount auth routes (public)
app.use('/api/auth', authRoutes);

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

// Mount protected routes
app.use('/api/payouts', verifyToken, payoutRoutes);
app.use('/api/ops', verifyToken, verifyAdmin, opsRoutes);
app.use('/api', verifyToken, payoutGuardRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CRWD Backend API is running',
    version: '2.0.0',
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

app.listen(port, () => {
  console.log(`🚀 CRWD Backend Server running on http://localhost:${port}`);
  console.log(`📊 Admin Dashboard: http://localhost:3000/admin-dashboard`);
  console.log(`💰 Payouts Management: http://localhost:3000/payout-list`);
});
