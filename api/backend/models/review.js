// review.js - Review data model with enhanced features
const { reviews } = require('../mockData');

class ReviewModel {
    static getAllReviews() {
        return reviews;
    }

    static getReviewById(id) {
        return reviews.find(review => review.id === parseInt(id));
    }

    static getReviewsByUser(userId) {
        return reviews.filter(review => review.user_id === userId);
    }

    static getPendingReviews() {
        return reviews.filter(review => review.payout_status === 'pending');
    }

    static getApprovedReviews() {
        return reviews.filter(review => review.payout_status === 'approved');
    }

    static getFlaggedReviews() {
        return reviews.filter(review => 
            review.payout_status === 'fraud' || review.fraud_score > 0.7
        );
    }

    static updatePayoutStatus(reviewId, status, adminId = null) {
        const review = reviews.find(r => r.id === parseInt(reviewId));
        if (review) {
            review.payout_status = status;
            if (status === 'approved' && adminId) {
                review.approved_at = new Date().toISOString().split('T')[0];
                review.approved_by = adminId;
            }
            if (status === 'fraud') {
                review.fraud_reason = review.fraud_reason || 'Manually flagged by admin';
            }
        }
        return review;
    }

    static getReviewStats() {
        const total = reviews.length;
        const pending = reviews.filter(r => r.payout_status === 'pending').length;
        const approved = reviews.filter(r => r.payout_status === 'approved').length;
        const rejected = reviews.filter(r => r.payout_status === 'rejected').length;
        const fraud = reviews.filter(r => r.payout_status === 'fraud').length;
        
        return { total, pending, approved, rejected, fraud };
    }

    static createReview(reviewData) {
        const newReview = {
            id: reviews.length + 1,
            ...reviewData,
            payout_amount: parseFloat(reviewData.payout_amount) || 25.00,
            rating: parseInt(reviewData.rating) || 5,
            created_at: new Date().toISOString().split('T')[0],
            payout_status: 'pending',
            fraud_score: Math.random() * 0.3, // Random low fraud score for new reviews
            verified: true
        };
        reviews.push(newReview);
        return newReview;
    }
}

module.exports = ReviewModel;