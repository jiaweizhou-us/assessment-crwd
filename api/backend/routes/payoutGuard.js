// payoutGuard.js - Enhanced refund status checking
const express = require('express');
const router = express.Router();
const TransactionModel = require('../models/transaction');
const ReviewModel = require('../models/review');
const UserModel = require('../models/user');

// Check refund status with enhanced fraud detection
router.post('/check-refund-status', (req, res) => {
    try {
        const { user_id, product_id, transaction_id } = req.body;
        
        // Validate input
        if (!user_id || !product_id || !transaction_id) {
            return res.status(400).json({
                success: false,
                status: 'Error',
                message: 'User ID, Product ID, and Transaction ID are required',
                payout_status: false
            });
        }

        // Check if the transaction exists and get details
        const transactionDetails = TransactionModel.checkRefundStatus(user_id, product_id, transaction_id);
        
        if (!transactionDetails) {
            return res.status(404).json({
                success: false,
                status: 'Not Found',
                message: 'Transaction not found or does not match the provided details',
                payout_status: false
            });
        }

        // Get user information
        const user = UserModel.getUserById(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                status: 'Error',
                message: 'User not found',
                payout_status: false
            });
        }

        // Check if user is flagged
        if (user.status === 'flagged') {
            return res.status(403).json({
                success: false,
                status: 'Account Flagged',
                message: 'Your account has been flagged. Please contact support.',
                payout_status: false,
                details: {
                    flag_reason: user.flag_reason,
                    flagged_at: user.flagged_at
                }
            });
        }

        // Check for existing reviews for this product
        const existingReviews = ReviewModel.getReviewsByUser(user_id);
        const productReview = existingReviews.find(review => review.product_id === product_id);

        // Determine payout eligibility
        let payout_status = false;
        let status = 'Payout Denied';
        let message = '';
        let details = {
            transaction: transactionDetails,
            user_status: user.status,
            has_reviewed: !!productReview
        };

        if (transactionDetails.refund_status) {
            // Product was refunded - deny payout
            status = 'Payout Denied';
            message = `Payout denied: Product "${transactionDetails.product_name}" was refunded on ${transactionDetails.refund_date}`;
            payout_status = false;
            
            // If there's a pending review, flag it as fraud
            if (productReview && productReview.payout_status === 'pending') {
                ReviewModel.updatePayoutStatus(productReview.id, 'fraud');
                details.review_status = 'flagged_as_fraud';
            }
        } else {
            // Product not refunded - check other conditions
            if (!productReview) {
                status = 'No Review Found';
                message = 'No review found for this product. Please submit a review first.';
                payout_status = false;
            } else {
                // Review exists - check status
                switch (productReview.payout_status) {
                    case 'pending':
                        status = 'Under Review';
                        message = 'Your review is under review for payout approval.';
                        payout_status = false;
                        details.estimated_payout = productReview.payout_amount;
                        break;
                    case 'approved':
                        status = 'Payout Approved';
                        message = `Payout of $${productReview.payout_amount} has been approved and will be processed soon.`;
                        payout_status = true;
                        details.payout_amount = productReview.payout_amount;
                        details.approved_at = productReview.approved_at;
                        break;
                    case 'rejected':
                        status = 'Payout Rejected';
                        message = 'Your payout request has been rejected.';
                        payout_status = false;
                        details.rejection_reason = productReview.rejection_reason;
                        break;
                    case 'fraud':
                        status = 'Fraudulent Activity Detected';
                        message = 'Fraudulent activity detected. Payout permanently denied.';
                        payout_status = false;
                        details.fraud_reason = productReview.fraud_reason;
                        break;
                    default:
                        status = 'Unknown Status';
                        message = 'Unable to determine payout status.';
                        payout_status = false;
                }
                details.review = productReview;
            }
        }

        // Add risk assessment for pending reviews
        if (productReview && productReview.payout_status === 'pending') {
            const userTransactions = TransactionModel.getTransactionsByUser(user_id);
            const userReviews = ReviewModel.getReviewsByUser(user_id);
            
            details.risk_assessment = {
                fraud_score: productReview.fraud_score,
                refund_history: userTransactions.filter(t => t.refund_status).length,
                previous_fraud: userReviews.filter(r => r.payout_status === 'fraud').length,
                account_age_days: Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24))
            };
        }

        res.json({
            success: true,
            status,
            message,
            payout_status,
            details
        });

    } catch (error) {
        console.error('Error checking refund status:', error);
        res.status(500).json({
            success: false,
            status: 'Error',
            message: 'Internal server error while checking refund status',
            payout_status: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Submit a review (new endpoint)
router.post('/submit-review', (req, res) => {
    try {
        const { product_id, product_name, review_text, rating, payout_amount } = req.body;
        const user_id = req.user.userId;

        // Validate input
        if (!product_id || !review_text || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, review text, and rating are required'
            });
        }

        // Check if user already reviewed this product
        const existingReviews = ReviewModel.getReviewsByUser(user_id);
        const existingReview = existingReviews.find(review => review.product_id === product_id);

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Create new review
        const reviewData = {
            user_id,
            product_id,
            product_name: product_name || `Product ${product_id}`,
            review_text,
            rating: parseInt(rating),
            payout_amount: payout_amount || 25.00
        };

        const newReview = ReviewModel.createReview(reviewData);

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: newReview
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting review',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get('/my-reviews', (req, res) => {
    try {
        const user_id = req.user.userId;
        const userReviews = ReviewModel.getReviewsByUser(user_id);
        
        const enrichedReviews = userReviews.map(review => {
            const userTransactions = TransactionModel.getTransactionsByUser(user_id);
            const productTransaction = userTransactions.find(t => t.product_id === review.product_id);
            
            return {
                ...review,
                transaction_status: productTransaction ? {
                    refunded: productTransaction.refund_status,
                    refund_date: productTransaction.refund_date,
                    purchase_amount: productTransaction.purchase_amount
                } : null
            };
        });

        res.json({
            success: true,
            count: enrichedReviews.length,
            data: enrichedReviews
        });

    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;