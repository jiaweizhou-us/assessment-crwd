// payouts.js - Enhanced payout management routes
const express = require('express');
const router = express.Router();
const ReviewModel = require('../models/review');
const UserModel = require('../models/user');
const TransactionModel = require('../models/transaction');

// Get all pending payouts with detailed information
router.get('/pending', (req, res) => {
    try {
        const pendingReviews = ReviewModel.getPendingReviews();
        
        // Enrich with user and transaction data
        const enrichedReviews = pendingReviews.map(review => {
            const user = UserModel.getUserById(review.user_id);
            const transactions = TransactionModel.getTransactionsByUser(review.user_id);
            const productTransaction = transactions.find(t => t.product_id === review.product_id);
            
            return {
                ...review,
                user: user,
                transaction: productTransaction,
                risk_assessment: {
                    fraud_score: review.fraud_score,
                    refund_risk: productTransaction?.refund_status || false,
                    user_history: {
                        total_reviews: user?.reviews_completed || 0,
                        total_earned: user?.total_earned || 0
                    }
                }
            };
        });

        res.json({
            success: true,
            count: enrichedReviews.length,
            data: enrichedReviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching pending payouts', error: error.message });
    }
});

// Get all approved payouts
router.get('/approved', (req, res) => {
    try {
        const approvedReviews = ReviewModel.getApprovedReviews();
        res.json({
            success: true,
            count: approvedReviews.length,
            data: approvedReviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching approved payouts', error: error.message });
    }
});

// Admin approves payout
router.post('/approve', (req, res) => {
    try {
        const { review_id } = req.body;
        const adminId = req.user?.username || 'admin'; // Get from JWT token
        
        const review = ReviewModel.updatePayoutStatus(review_id, 'approved', adminId);
        
        if (review) {
            // Update user earnings
            UserModel.updateUserEarnings(review.user_id, review.payout_amount);
            
            res.json({ 
                success: true, 
                message: 'Payout approved successfully', 
                data: review 
            });
        } else {
            res.status(404).json({ success: false, message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error approving payout', error: error.message });
    }
});

// Admin rejects payout
router.post('/reject', (req, res) => {
    try {
        const { review_id, reason } = req.body;
        const adminId = req.user?.username || 'admin';
        
        const review = ReviewModel.updatePayoutStatus(review_id, 'rejected', adminId);
        
        if (review) {
            review.rejection_reason = reason || 'No reason provided';
            
            res.json({ 
                success: true, 
                message: 'Payout rejected successfully', 
                data: review 
            });
        } else {
            res.status(404).json({ success: false, message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error rejecting payout', error: error.message });
    }
});

// Flag review as fraudulent
router.post('/flag-fraud', (req, res) => {
    try {
        const { review_id, reason } = req.body;
        const adminId = req.user?.username || 'admin';
        
        const review = ReviewModel.updatePayoutStatus(review_id, 'fraud', adminId);
        
        if (review) {
            review.fraud_reason = reason || 'Flagged as fraudulent';
            
            // Also flag the user if multiple fraud cases
            const userReviews = ReviewModel.getReviewsByUser(review.user_id);
            const fraudReviews = userReviews.filter(r => r.payout_status === 'fraud');
            
            if (fraudReviews.length >= 2) {
                UserModel.flagUser(review.user_id, 'Multiple fraudulent reviews detected');
            }
            
            res.json({ 
                success: true, 
                message: 'Review flagged as fraud successfully', 
                data: review 
            });
        } else {
            res.status(404).json({ success: false, message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error flagging review', error: error.message });
    }
});

// Bulk approve payouts
router.post('/bulk-approve', (req, res) => {
    try {
        const { review_ids } = req.body;
        const adminId = req.user?.username || 'admin';
        
        if (!Array.isArray(review_ids)) {
            return res.status(400).json({ success: false, message: 'review_ids must be an array' });
        }
        
        const results = review_ids.map(review_id => {
            const review = ReviewModel.updatePayoutStatus(review_id, 'approved', adminId);
            if (review) {
                UserModel.updateUserEarnings(review.user_id, review.payout_amount);
                return { review_id, success: true, review };
            } else {
                return { review_id, success: false, error: 'Review not found' };
            }
        });
        
        const successCount = results.filter(r => r.success).length;
        
        res.json({
            success: true,
            message: `${successCount} payouts approved successfully`,
            results
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error bulk approving payouts', error: error.message });
    }
});

// Get payout statistics
router.get('/stats', (req, res) => {
    try {
        const reviewStats = ReviewModel.getReviewStats();
        const userStats = UserModel.getUserStats();
        const transactionStats = TransactionModel.getTransactionStats();
        
        const totalPendingAmount = ReviewModel.getPendingReviews()
            .reduce((sum, review) => sum + review.payout_amount, 0);
        
        const totalApprovedAmount = ReviewModel.getApprovedReviews()
            .reduce((sum, review) => sum + review.payout_amount, 0);
        
        res.json({
            success: true,
            data: {
                reviews: reviewStats,
                users: userStats,
                transactions: transactionStats,
                payouts: {
                    pending_amount: totalPendingAmount,
                    approved_amount: totalApprovedAmount,
                    total_paid: userStats.totalEarnings
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching statistics', error: error.message });
    }
});

module.exports = router;