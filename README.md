# 🔐 CRWD Platform - Consumer Review With Data

A comprehensive full-stack platform for managing consumer reviews, payouts, and fraud detection with advanced security features and admin operations dashboard.

![CRWD Platform](https://img.shields.io/badge/Platform-CRWD-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19+-blue?style=for-the-badge&logo=react)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

## 🚀 Features Overview

### 🎯 **Core Platform Features**
- **Consumer Review Management**: Submit, track, and manage product reviews
- **Automated Payout System**: Smart payout approval with fraud detection
- **Advanced Fraud Detection**: ML-powered fraud scoring and risk assessment
- **Role-Based Access Control**: Separate user and admin interfaces
- **Real-time Operations Dashboard**: Comprehensive admin analytics and monitoring

### 🔒 **Security & Authentication**
- **JWT-based Authentication**: Secure token-based user authentication
- **bcrypt Password Hashing**: Industry-standard password security
- **Role-based Permissions**: User/Admin access level management
- **CORS Protection**: Secure cross-origin request handling

### 💰 **Payout Management**
- **Manual Payout Approval**: Admin-controlled payout verification
- **Bulk Operations**: Process multiple payouts simultaneously
- **Fraud Prevention**: Automatic flagging of suspicious activities
- **Comprehensive Analytics**: Detailed payout statistics and trends

### 🛡️ **Fraud Detection System**
- **Real-time Risk Scoring**: Advanced algorithm for fraud detection
- **Pattern Recognition**: Identifies suspicious user behavior
- **Refund Analysis**: Cross-references refunds with payout requests
- **User Flagging System**: Manual and automatic user flagging

## 🏗️ Architecture

```
CRWD Platform
├── Frontend (React + Material-UI)
│   ├── 🏠 User Dashboard (Payout Guard)
│   ├── 🔐 Admin Dashboard (Operations)
│   ├── 💰 Payout Management
│   └── 📊 Analytics & Reporting
│
├── Backend (Node.js + Express)
│   ├── 🔐 Authentication Service
│   ├── 💰 Payout Management API
│   ├── 🛡️ Fraud Detection Engine
│   └── 📊 Operations API
│
└── Deployment (Vercel)
    ├── 🌐 Static Frontend Hosting
    ├── ⚡ Serverless API Functions
    └── 🔧 Environment Configuration
```

## 📋 Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: Latest version
- **Git**: For version control
- **Vercel CLI**: For deployment (optional)

## 🚀 Quick Start

### 1. Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd CRWD

# Install all dependencies
npm run install:all
```

### 2. Start Development Environment
```bash
# Option 1: Auto-start both frontend and backend
./start-dev.sh

# Option 2: Manual start
npm run dev

# Option 3: Start individually
npm run backend    # Start backend only
npm run frontend   # Start frontend only
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

## 🧪 Test Credentials

### User Accounts
| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| User | `user1` | `password123` | Payout Guard, Review Submission |
| User | `user2` | `password123` | Payout Guard, Review Submission |
| Admin | `admin` | `password123` | Full Admin Dashboard Access |

## 📁 Project Structure

```
CRWD/
├── 📱 frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── AuthForm.js      # Authentication interface
│   │   │   ├── PayoutGuard.js   # User dashboard
│   │   │   ├── AdminDashboard.js # Admin operations
│   │   │   └── PayoutList.js    # Payout management
│   │   ├── config/
│   │   │   └── api.js          # API configuration
│   │   └── App.js              # Main application component
│   ├── package.json
│   └── README.md
│
├── 🔧 api/                      # Backend API server
│   ├── backend/
│   │   ├── server.js           # Main server configuration
│   │   ├── mockData.js         # Test data
│   │   ├── models/             # Data models
│   │   │   ├── user.js         # User management
│   │   │   ├── review.js       # Review operations
│   │   │   └── transaction.js  # Transaction handling
│   │   └── routes/             # API endpoints
│   │       ├── auth.js         # Authentication
│   │       ├── payouts.js      # Payout management
│   │       ├── ops.js          # Admin operations
│   │       └── payoutGuard.js  # User operations
│   ├── index.js                # Vercel serverless entry
│   ├── package.json
│   └── README.md
│
├── 🚀 Deployment Files
│   ├── vercel.json             # Vercel configuration
│   ├── start-dev.sh           # Development startup script
│   ├── deploy-check.sh        # Pre-deployment checks
│   └── DEPLOYMENT.md          # Deployment guide
│
├── package.json                # Root package.json
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🎮 User Interface

### 👤 **User Dashboard (Payout Guard)**
- **Status Checker**: Check payout status for transactions
- **Review Submission**: Submit new product reviews
- **Review History**: View submitted reviews and their status
- **Payout Tracking**: Monitor pending and approved payouts

### 🔐 **Admin Dashboard**
- **Operations Overview**: Real-time platform metrics
- **Fraud Detection**: Monitor flagged reviews and users
- **Payout Management**: Approve/reject payout requests
- **User Management**: Flag/unflag suspicious users
- **Analytics**: Comprehensive platform analytics

## 🛡️ Fraud Detection Engine

### Risk Assessment Factors
- **Refund History**: Cross-references product refunds with payout requests
- **User Behavior**: Analyzes user patterns and previous fraud cases
- **Review Quality**: Evaluates review content and authenticity
- **Account Age**: Considers account creation date and activity
- **Transaction Patterns**: Monitors unusual transaction behaviors

### Risk Levels
- 🟢 **LOW (0.0-0.4)**: Minimal risk, auto-approve eligible
- 🟡 **MEDIUM (0.4-0.7)**: Manual review required
- 🔴 **HIGH (0.7-1.0)**: High fraud risk, detailed investigation needed

## 📊 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Token verification

### 👤 User Operations
- `POST /api/check-refund-status` - Check transaction status
- `POST /api/submit-review` - Submit product review
- `GET /api/my-reviews` - Get user's reviews

### 💰 Payout Management (Admin)
- `GET /api/payouts/pending` - Get pending payouts
- `POST /api/payouts/approve` - Approve payout
- `POST /api/payouts/reject` - Reject payout
- `POST /api/payouts/bulk-approve` - Bulk approve payouts

### 📊 Operations (Admin)
- `GET /api/ops/dashboard` - Admin dashboard data
- `GET /api/ops/flagged-reviews` - Flagged reviews
- `POST /api/ops/flag-user` - Flag suspicious user
- `POST /api/ops/detect-fraud` - Run fraud detection

## 🚀 Deployment

### Development
```bash
# Start development environment
npm run dev

# Run pre-deployment checks
./deploy-check.sh
```

### Production (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### Environment Variables
```env
# Backend (.env)
JWT_SECRET=your-super-secure-jwt-secret
NODE_ENV=production
PORT=5000

# Frontend (.env.production)
REACT_APP_API_URL=https://your-app.vercel.app/api
```

## 🧪 Testing

### Manual Testing
1. **User Flow**: Login → Submit Review → Check Status
2. **Admin Flow**: Login → Review Dashboard → Approve Payouts
3. **Fraud Detection**: Test with flagged scenarios

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password123"}'

# Test payout check
curl -X POST http://localhost:5000/api/check-refund-status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"user_id":"user1","product_id":"PROD001","transaction_id":"TXN001"}'
```

## 🛠️ Development

### Adding New Features
1. **Backend**: Add routes in `/api/backend/routes/`
2. **Frontend**: Add components in `/frontend/src/components/`
3. **Models**: Update data models in `/api/backend/models/`
4. **API**: Update API configuration in `/frontend/src/config/api.js`

### Code Style
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Comments**: Comprehensive code documentation

## 🔧 Configuration

### Development Scripts
```json
{
  "dev": "Start development environment",
  "start": "Start production server",
  "build": "Build for production",
  "test": "Run test suite",
  "deploy": "Deploy to production"
}
```

### Hot-Loading
- **Frontend**: React Fast Refresh enabled
- **Backend**: Manual restart required for changes
- **Environment**: Optimized for development performance

## 📈 Performance

### Optimization Features
- **Static Asset Optimization**: Minified CSS/JS
- **Serverless Functions**: Optimized for Vercel
- **Lazy Loading**: Component-based code splitting
- **Caching**: Efficient API response caching

### Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Built-in performance monitoring
- **API Analytics**: Request/response monitoring

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📝 Documentation

- **[Backend API](./api/README.md)**: Comprehensive API documentation
- **[Frontend Guide](./frontend/README.md)**: Frontend development guide
- **[Deployment Guide](./DEPLOYMENT.md)**: Production deployment instructions

## 🆘 Support & Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version (18+)
2. **API Connection**: Verify backend is running on port 5000
3. **Authentication**: Ensure JWT_SECRET is set
4. **CORS Errors**: Check allowed origins in server configuration

### Getting Help
- **Documentation**: Check the guides in `/docs/`
- **Issues**: Create GitHub issues for bugs
- **Development**: Review code comments and API docs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Material-UI**: For the beautiful component library
- **Vercel**: For seamless deployment platform
- **Node.js Community**: For the robust backend ecosystem

---

## 🎯 Quick Navigation

- 📱 **[Frontend Documentation](./frontend/README.md)**
- 🔧 **[Backend Documentation](./api/README.md)**
- 🚀 **[Deployment Guide](./DEPLOYMENT.md)**
- 🧪 **[Testing Guide](#testing)**
- 🛡️ **[Security Features](#security--authentication)**

**Built with ❤️ for secure and efficient review management**
