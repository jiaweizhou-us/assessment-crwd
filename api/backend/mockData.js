// mockData.js - Enhanced mock data for CRWD platform

const users = [
    { 
        id: 'user1', 
        username: 'user1', 
        password: '$2a$10$Dc9BXHsJUgk/Qn6TDYrUNeH/6tNxzUdxEkoZ7biDWmdbFG1vcLoIC', // password: "password123"
        email: 'user1@example.com',
        status: 'active',
        created_at: '2025-01-01',
        total_earned: 150.00,
        reviews_completed: 5
    },
    { 
        id: 'user2', 
        username: 'user2', 
        password: '$2a$10$Dc9BXHsJUgk/Qn6TDYrUNeH/6tNxzUdxEkoZ7biDWmdbFG1vcLoIC', // password: "password123"
        email: 'user2@example.com',
        status: 'active',
        created_at: '2025-01-15',
        total_earned: 75.00,
        reviews_completed: 3
    },
    { 
        id: 'admin1', 
        username: 'admin', 
        password: '$2a$10$Dc9BXHsJUgk/Qn6TDYrUNeH/6tNxzUdxEkoZ7biDWmdbFG1vcLoIC', // password: "password123"
        email: 'admin@crwd.com',
        status: 'active',
        role: 'admin',
        created_at: '2024-12-01',
        total_earned: 0,
        reviews_completed: 0
    }
];

const reviews = [
    { 
        id: 1, 
        user_id: 'user1', 
        product_id: 'product1', 
        product_name: 'Wireless Headphones Pro',
        review_text: 'Amazing sound quality! The noise cancellation is outstanding.',
        rating: 5,
        payout_status: 'pending',
        payout_amount: 25.00,
        created_at: '2025-10-15',
        fraud_score: 0.1,
        verified: true
    },
    { 
        id: 2, 
        user_id: 'user2', 
        product_id: 'product2', 
        product_name: 'Smart Watch Ultra',
        review_text: 'Good fitness tracking but battery life could be better.',
        rating: 4,
        payout_status: 'pending',
        payout_amount: 20.00,
        created_at: '2025-10-14',
        fraud_score: 0.3,
        verified: true
    },
    { 
        id: 3, 
        user_id: 'user1', 
        product_id: 'product3', 
        product_name: 'Gaming Keyboard RGB',
        review_text: 'Perfect for gaming! The RGB lighting is customizable.',
        rating: 5,
        payout_status: 'approved',
        payout_amount: 30.00,
        created_at: '2025-10-10',
        fraud_score: 0.05,
        verified: true,
        approved_at: '2025-10-12',
        approved_by: 'admin1'
    },
    { 
        id: 4, 
        user_id: 'user2', 
        product_id: 'product4', 
        product_name: 'Bluetooth Speaker',
        review_text: 'Terrible sound quality, not worth the money.',
        rating: 1,
        payout_status: 'fraud',
        payout_amount: 15.00,
        created_at: '2025-10-13',
        fraud_score: 0.8,
        verified: false,
        fraud_reason: 'Suspicious review pattern detected'
    }
];

const transactions = [
    { 
        transaction_id: 'txn123', 
        user_id: 'user1',
        username: 'user1',
        email: 'user1@example.com',
        product_id: 'product1', 
        product_name: 'Wireless Headphones Pro',
        refund_status: false,
        purchase_amount: 199.99,
        purchase_date: '2025-10-14',
        refund_date: null,
        refund_amount: 0,
        payment_method: 'credit_card',
        status: 'completed'
    },
    { 
        transaction_id: 'txn124', 
        user_id: 'user2',
        username: 'user2',
        email: 'user2@example.com',
        product_id: 'product2', 
        product_name: 'Smart Watch Ultra',
        refund_status: true,
        purchase_amount: 299.99,
        purchase_date: '2025-10-13',
        refund_date: '2025-10-15',
        refund_amount: 299.99,
        payment_method: 'paypal',
        status: 'refunded'
    },
    { 
        transaction_id: 'txn125', 
        user_id: 'user1',
        username: 'user1',
        email: 'user1@example.com',
        product_id: 'product3', 
        product_name: 'Gaming Keyboard RGB',
        refund_status: false,
        purchase_amount: 149.99,
        purchase_date: '2025-10-09',
        refund_date: null,
        refund_amount: 0,
        payment_method: 'credit_card',
        status: 'completed'
    },
    { 
        transaction_id: 'txn126', 
        user_id: 'user2',
        username: 'user2',
        email: 'user2@example.com',
        product_id: 'product4', 
        product_name: 'Bluetooth Speaker',
        refund_status: true,
        purchase_amount: 79.99,
        purchase_date: '2025-10-12',
        refund_date: '2025-10-14',
        refund_amount: 79.99,
        payment_method: 'debit_card',
        status: 'refunded'
    },
    { 
        transaction_id: 'txn127', 
        user_id: 'user1',
        username: 'user1',
        email: 'user1@example.com',
        product_id: 'product5', 
        product_name: 'Wireless Mouse',
        refund_status: false,
        purchase_amount: 59.99,
        purchase_date: '2025-10-16',
        refund_date: null,
        refund_amount: 0,
        payment_method: 'credit_card',
        status: 'completed'
    }
];

const payouts = [
    {
        id: 1,
        review_id: 3,
        user_id: 'user1',
        amount: 30.00,
        status: 'completed',
        approved_by: 'admin1',
        approved_at: '2025-10-12',
        paid_at: '2025-10-13',
        payment_method: 'paypal'
    }
];

module.exports = { users, reviews, transactions, payouts };
