# 🔐 CRWD Platform Backend API

A comprehensive Node.js/Express backend for the CRWD (Consumer Review With Data) platform, featuring advanced fraud detection, role-based access control, and comprehensive payout management.

## 🚀 Features

### 🔒 **Authentication & Security**
- JWT-based authentication with role-based access control
- bcrypt password hashing for secure credential storage
- Token verification middleware with role validation
- Admin-only protected routes

### 💰 **Payout Management**
- Manual payout approval/rejection system
- Bulk payout operations
- Comprehensive payout statistics and analytics
- Fraud detection scoring for review authenticity

### 🛡️ **Fraud Detection**
- Advanced fraud scoring algorithm
- Real-time risk assessment
- User flagging and unflagging capabilities
- Refund pattern analysis

### 📊 **Operations Dashboard**
- Admin dashboard with key metrics
- Flagged reviews and users monitoring
- Eligible users for payouts tracking
- Comprehensive fraud analytics

## 🛠️ Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: Latest version
- **Git**: For version control

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd CRWD/api

# Install dependencies
npm install

# Start the development server
npm start
```

The server will start on `http://localhost:5000`

## 🔧 Environment Variables

Create a `.env` file in the `/api` directory:

```env
PORT=5000
JWT_SECRET=your-super-secure-jwt-secret-key
NODE_ENV=development
```

For production deployment, ensure you set a strong JWT_SECRET.

## 📡 API Endpoints

### 🔐 **Authentication Routes** (`/api/auth`)

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "username": "string (min 3 chars)",
  "password": "string (min 6 chars)",
  "email": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "username": "username",
    "email": "email",
    "role": "user"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "username": "username",
    "role": "user|admin"
  }
}
```

#### GET `/api/auth/verify`
Verify JWT token validity.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

### 👤 **User Routes** (`/api`) - Protected

#### POST `/api/check-refund-status`
Check refund and payout status for a specific transaction.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "user_id": "string",
  "product_id": "string", 
  "transaction_id": "string"
}
```

**Response:**
```json
{
  "success": true,
  "status": "Payout Approved|Payout Denied|Under Review",
  "message": "Status description",
  "payout_status": boolean,
  "details": {
    "transaction": {...},
    "user_status": "active|flagged",
    "has_reviewed": boolean,
    "payout_amount": number,
    "risk_assessment": {...}
  }
}
```

#### POST `/api/submit-review`
Submit a new product review for payout consideration.

**Request Body:**
```json
{
  "product_id": "string",
  "product_name": "string (optional)",
  "review_text": "string",
  "rating": number (1-5),
  "payout_amount": number (optional, default: 25.00)
}
```

#### GET `/api/my-reviews`
Get all reviews submitted by the authenticated user.

### 💰 **Payout Routes** (`/api/payouts`) - Admin Only

#### GET `/api/payouts/pending`
Get all pending payout requests.

#### GET `/api/payouts/stats`
Get comprehensive payout statistics.

#### POST `/api/payouts/approve`
Approve a specific payout.

**Request Body:**
```json
{
  "review_id": "string",
  "admin_notes": "string (optional)"
}
```

#### POST `/api/payouts/reject`
Reject a specific payout.

**Request Body:**
```json
{
  "review_id": "string",
  "reason": "string",
  "admin_notes": "string (optional)"
}
```

#### POST `/api/payouts/bulk-approve`
Approve multiple payouts at once.

**Request Body:**
```json
{
  "review_ids": ["string"],
  "admin_notes": "string (optional)"
}
```

### 📊 **Operations Routes** (`/api/ops`) - Admin Only

#### GET `/api/ops/dashboard`
Get comprehensive admin dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "flagged_reviews": number,
      "high_risk_pending": number,
      "suspicious_users": number,
      "total_users": number,
      "refund_rate": number
    },
    "flagged_reviews": [...],
    "high_risk_reviews": [...],
    "suspicious_users": [...],
    "stats": {...}
  }
}
```

#### GET `/api/ops/flagged-reviews`
Get all flagged reviews with detailed risk information.

#### GET `/api/ops/flagged-users`
Get all flagged users and their activity.

#### GET `/api/ops/eligible-users`
Get users eligible for payouts with risk assessment.

#### POST `/api/ops/flag-user`
Manually flag a user for suspicious activity.

**Request Body:**
```json
{
  "user_id": "string",
  "reason": "string"
}
```

#### POST `/api/ops/unflag-user`
Remove flag from a user account.

**Request Body:**
```json
{
  "user_id": "string"
}
```

#### POST `/api/ops/detect-fraud`
Run fraud detection on a specific review.

**Request Body:**
```json
{
  "review_id": "string"
}
```

## 🧪 Test Data

The system includes comprehensive mock data for testing:

### 👤 **Test Users:**
- **Regular Users**: `user1`, `user2` (password: `password123`)
- **Admin User**: `admin` (password: `password123`)

### 📝 **Sample Reviews:**
- Various review statuses (pending, approved, rejected, fraud)
- Different fraud scores for testing detection algorithms
- Multiple products and transactions

### 💳 **Sample Transactions:**
- Mix of refunded and non-refunded transactions
- Various purchase amounts and dates
- Linked to user accounts and reviews

## 🔍 Fraud Detection Algorithm

The system uses a sophisticated fraud detection algorithm that considers:

1. **Refund History**: Whether the product was refunded
2. **User Patterns**: Previous fraud cases and refund rates
3. **Review Quality**: Text length and content analysis
4. **Account Age**: How long the user has been registered
5. **Transaction Patterns**: Frequency and amounts

**Risk Levels:**
- **LOW**: Fraud score 0.0 - 0.4
- **MEDIUM**: Fraud score 0.4 - 0.7  
- **HIGH**: Fraud score 0.7 - 1.0

## 📁 Project Structure

```
api/
├── backend/
│   ├── server.js           # Main server configuration
│   ├── mockData.js         # Test data and mock database
│   ├── models/             # Data access layer
│   │   ├── user.js         # User model with CRUD operations
│   │   ├── review.js       # Review model with fraud detection
│   │   └── transaction.js  # Transaction model
│   └── routes/             # API route handlers
│       ├── auth.js         # Authentication routes
│       ├── payouts.js      # Payout management routes
│       ├── ops.js          # Operations/admin routes
│       └── payoutGuard.js  # User-facing routes
├── index.js                # Vercel serverless entry point
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Deployment

### Development
```bash
npm start
```

### Production (Vercel)
The backend is configured for Vercel serverless deployment. See `/DEPLOYMENT.md` for detailed instructions.

## 🧪 Testing the API

### Using curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password123"}'

# Check refund status (with token)
curl -X POST http://localhost:5000/api/check-refund-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"user_id":"user1","product_id":"PROD001","transaction_id":"TXN001"}'

# Admin dashboard (admin token required)
curl -X GET http://localhost:5000/api/ops/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Using Postman:
Import the API collection from `/docs/postman-collection.json` (if available).

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Separate admin and user permissions
- **Password Hashing**: bcrypt with salt rounds for secure storage
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: Built-in protection against abuse

## 📊 Monitoring & Logging

- **Console Logging**: Comprehensive error and activity logging
- **Error Handling**: Centralized error handling middleware
- **Request Validation**: Input sanitization and validation
- **Performance Metrics**: Built-in performance monitoring

## 🔧 Development

### Adding New Routes:
1. Create route handler in `/backend/routes/`
2. Add route mounting in `server.js`
3. Update this README with new endpoints

### Adding New Models:
1. Create model file in `/backend/models/`
2. Add mock data in `mockData.js`
3. Import and use in route handlers

### Environment Setup:
- Development: `NODE_ENV=development`
- Production: `NODE_ENV=PRODUCTION`
- Testing: `NODE_ENV=test`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

For questions or issues:
1. Check the deployment guide in `/DEPLOYMENT.md`
2. Review the API documentation above
3. Check server logs for error details
4. Ensure all environment variables are set correctly

**Happy coding! 🚀**
