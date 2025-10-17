// ops.js - Operations dashboard routes for admin visibility
const express = require('express');
const router = express.Router();
const ReviewModel = require('../models/review');
const UserModel = require('../models/user');
const TransactionModel = require('../models/transaction');

// Admin Dashboard - Overview of flagged reviews and suspicious activities
router.get('/dashboard', (req, res) => {
    try {
        const flaggedReviews = ReviewModel.getFlaggedReviews();
        const pendingReviews = ReviewModel.getPendingReviews();
        const reviewStats = ReviewModel.getReviewStats();
        const userStats = UserModel.getUserStats();
        const transactionStats = TransactionModel.getTransactionStats();

        // High-risk pending reviews (fraud score > 0.5)
        const highRiskReviews = pendingReviews.filter(review => review.fraud_score > 0.5);

        // Users with refunded products who have pending payouts
        const suspiciousUsers = pendingReviews.filter(review => {
            const userTransactions = TransactionModel.getTransactionsByUser(review.user_id);
            const hasRefunds = userTransactions.some(t => t.refund_status === true);
            return hasRefunds;
        });

        res.json({
            success: true,
            data: {
                summary: {
                    flagged_reviews: flaggedReviews.length,
                    high_risk_pending: highRiskReviews.length,
                    suspicious_users: suspiciousUsers.length,
                    total_users: userStats.total,
                    refund_rate: transactionStats.refundRate
                },
                flagged_reviews: flaggedReviews,
                high_risk_reviews: highRiskReviews,
                suspicious_users: suspiciousUsers,
                stats: {
                    reviews: reviewStats,
                    users: userStats,
                    transactions: transactionStats
                }
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching dashboard data', 
            error: error.message 
        });
    }
});

// Get all flagged reviews with detailed information
router.get('/flagged-reviews', (req, res) => {
    try {
        const flaggedReviews = ReviewModel.getFlaggedReviews();
        
        const enrichedReviews = flaggedReviews.map(review => {
            const user = UserModel.getUserById(review.user_id);
            const userTransactions = TransactionModel.getTransactionsByUser(review.user_id);
            const userReviews = ReviewModel.getReviewsByUser(review.user_id);
            
            return {
                ...review,
                user_info: {
                    username: user?.username,
                    status: user?.status,
                    total_earned: user?.total_earned,
                    reviews_completed: user?.reviews_completed
                },
                risk_factors: {
                    multiple_refunds: userTransactions.filter(t => t.refund_status).length,
                    fraud_reviews: userReviews.filter(r => r.payout_status === 'fraud').length,
                    avg_fraud_score: userReviews.length > 0 ? 
                        userReviews.reduce((sum, r) => sum + (parseFloat(r.fraud_score) || 0), 0) / userReviews.length : 0
                }
            };
        });

        res.json({
            success: true,
            count: enrichedReviews.length,
            data: enrichedReviews
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching flagged reviews', 
            error: error.message 
        });
    }
});

// Get users eligible for payouts (pending reviews)
router.get('/eligible-users', (req, res) => {
    try {
        const pendingReviews = ReviewModel.getPendingReviews();
        
        // Group by user
        const userEligibility = {};
        
        pendingReviews.forEach(review => {
            if (!userEligibility[review.user_id]) {
                const user = UserModel.getUserById(review.user_id);
                const userTransactions = TransactionModel.getTransactionsByUser(review.user_id);
                const userReviews = ReviewModel.getReviewsByUser(review.user_id);
                
                userEligibility[review.user_id] = {
                    user_info: user,
                    pending_reviews: [],
                    total_pending_amount: 0,
                    risk_assessment: {
                        refunds_count: userTransactions.filter(t => t.refund_status).length,
                        avg_fraud_score: userReviews.length > 0 ? 
                            userReviews.reduce((sum, r) => sum + (parseFloat(r.fraud_score) || 0), 0) / userReviews.length : 0,
                        previous_fraud: userReviews.filter(r => r.payout_status === 'fraud').length,
                        account_age_days: Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24))
                    }
                };
            }
            
            userEligibility[review.user_id].pending_reviews.push(review);
            userEligibility[review.user_id].total_pending_amount += parseFloat(review.payout_amount) || 0;
        });

        // Convert to array and sort by risk
        const eligibleUsers = Object.values(userEligibility).map(user => {
            const avgFraudScore = parseFloat(user.risk_assessment.avg_fraud_score) || 0;
            const refundRate = user.risk_assessment.refunds_count / Math.max(user.pending_reviews.length, 1);
            const fraudRate = user.risk_assessment.previous_fraud / Math.max(user.user_info.reviews_completed || 1, 1);
            
            const riskScore = (
                avgFraudScore * 0.4 +
                refundRate * 0.3 +
                fraudRate * 0.3
            );
            
            return {
                ...user,
                total_pending_amount: parseFloat(user.total_pending_amount) || 0,
                risk_score: Math.min(riskScore, 1),
                risk_level: riskScore > 0.7 ? 'HIGH' : riskScore > 0.4 ? 'MEDIUM' : 'LOW'
            };
        }).sort((a, b) => b.risk_score - a.risk_score);

        res.json({
            success: true,
            count: eligibleUsers.length,
            data: eligibleUsers
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching eligible users', 
            error: error.message 
        });
    }
});

// Get users flagged for suspicious activity
router.get('/flagged-users', (req, res) => {
    try {
        const allUsers = UserModel.getAllUsers();
        const flaggedUsers = allUsers.filter(user => user.status === 'flagged');
        
        const enrichedUsers = flaggedUsers.map(user => {
            const userReviews = ReviewModel.getReviewsByUser(user.id);
            const userTransactions = TransactionModel.getTransactionsByUser(user.id);
            
            return {
                ...user,
                reviews: {
                    total: userReviews.length,
                    fraud: userReviews.filter(r => r.payout_status === 'fraud').length,
                    pending: userReviews.filter(r => r.payout_status === 'pending').length
                },
                transactions: {
                    total: userTransactions.length,
                    refunded: userTransactions.filter(t => t.refund_status).length
                }
            };
        });

        res.json({
            success: true,
            count: enrichedUsers.length,
            data: enrichedUsers
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching flagged users', 
            error: error.message 
        });
    }
});

// Flag a user manually
router.post('/flag-user', (req, res) => {
    try {
        const { user_id, reason } = req.body;
        
        if (!user_id || !reason) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID and reason are required' 
            });
        }

        const user = UserModel.flagUser(user_id, reason);
        
        if (user) {
            res.json({ 
                success: true, 
                message: 'User flagged successfully', 
                data: user 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error flagging user', 
            error: error.message 
        });
    }
});

// Unflag a user
router.post('/unflag-user', (req, res) => {
    try {
        const { user_id } = req.body;
        
        if (!user_id) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        const user = UserModel.unflagUser(user_id);
        
        if (user) {
            res.json({ 
                success: true, 
                message: 'User unflagged successfully', 
                data: user 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error unflagging user', 
            error: error.message 
        });
    }
});

// Real-time fraud detection endpoint
router.post('/detect-fraud', (req, res) => {
    try {
        const { review_id } = req.body;
        
        if (!review_id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Review ID is required' 
            });
        }

        const review = ReviewModel.getReviewById(review_id);
        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: 'Review not found' 
            });
        }

        const user = UserModel.getUserById(review.user_id);
        const userTransactions = TransactionModel.getTransactionsByUser(review.user_id);
        const userReviews = ReviewModel.getReviewsByUser(review.user_id);

        // Fraud detection algorithm
        let fraudScore = review.fraud_score || 0;
        const fraudFactors = [];

        // Check for product refund
        const productTransaction = userTransactions.find(t => t.product_id === review.product_id);
        if (productTransaction && productTransaction.refund_status) {
            fraudScore += 0.4;
            fraudFactors.push('Product was refunded');
        }

        // Check user history
        const fraudReviews = userReviews.filter(r => r.payout_status === 'fraud').length;
        if (fraudReviews > 0) {
            fraudScore += 0.3;
            fraudFactors.push(`User has ${fraudReviews} previous fraud cases`);
        }

        // Check refund pattern
        const refundRate = userTransactions.filter(t => t.refund_status).length / userTransactions.length;
        if (refundRate > 0.5) {
            fraudScore += 0.2;
            fraudFactors.push(`High refund rate: ${(refundRate * 100).toFixed(1)}%`);
        }

        // Check review quality
        if (review.review_text.length < 20) {
            fraudScore += 0.1;
            fraudFactors.push('Review text is too short');
        }

        fraudScore = Math.min(fraudScore, 1);

        res.json({
            success: true,
            data: {
                review_id: review.id,
                fraud_score: fraudScore,
                risk_level: fraudScore > 0.7 ? 'HIGH' : fraudScore > 0.4 ? 'MEDIUM' : 'LOW',
                fraud_factors: fraudFactors,
                recommendation: fraudScore > 0.7 ? 'REJECT' : fraudScore > 0.4 ? 'MANUAL_REVIEW' : 'APPROVE'
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error detecting fraud', 
            error: error.message 
        });
    }
});

module.exports = router;