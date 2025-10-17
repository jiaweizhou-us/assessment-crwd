// transaction.js - Transaction data model with enhanced features
const { transactions } = require('../mockData');

class TransactionModel {
    static getAllTransactions() {
        return transactions;
    }

    static getTransactionById(transactionId) {
        return transactions.find(transaction => transaction.transaction_id === transactionId);
    }

    static getTransactionsByUser(userId) {
        return transactions.filter(transaction => transaction.user_id === userId);
    }

    static getRefundedTransactions() {
        return transactions.filter(transaction => transaction.refund_status === true);
    }

    static getActiveTransactions() {
        return transactions.filter(transaction => transaction.refund_status === false);
    }

    static checkRefundStatus(userId, productId, transactionId) {
        const transaction = transactions.find(t => 
            t.user_id === userId && 
            t.product_id === productId && 
            t.transaction_id === transactionId
        );
        
        if (!transaction) {
            return null;
        }

        return {
            transaction_id: transaction.transaction_id,
            product_id: transaction.product_id,
            product_name: transaction.product_name,
            refund_status: transaction.refund_status,
            purchase_amount: transaction.purchase_amount,
            purchase_date: transaction.purchase_date,
            refund_date: transaction.refund_date,
            refund_amount: transaction.refund_amount
        };
    }

    static updateRefundStatus(transactionId, refundStatus, refundAmount = 0) {
        const transaction = transactions.find(t => t.transaction_id === transactionId);
        if (transaction) {
            transaction.refund_status = refundStatus;
            if (refundStatus) {
                transaction.refund_date = new Date().toISOString().split('T')[0];
                transaction.refund_amount = refundAmount || transaction.purchase_amount;
            }
        }
        return transaction;
    }

    static getTransactionStats() {
        const total = transactions.length;
        const refunded = transactions.filter(t => t.refund_status === true).length;
        const active = total - refunded;
        const totalRefundAmount = transactions
            .filter(t => t.refund_status === true)
            .reduce((sum, t) => sum + t.refund_amount, 0);
        const totalPurchaseAmount = transactions
            .reduce((sum, t) => sum + t.purchase_amount, 0);
        
        return { 
            total, 
            active, 
            refunded, 
            totalPurchaseAmount, 
            totalRefundAmount,
            refundRate: total > 0 ? (refunded / total * 100).toFixed(2) : 0
        };
    }

    static createTransaction(transactionData) {
        const newTransaction = {
            transaction_id: `txn${Date.now()}`,
            ...transactionData,
            refund_status: false,
            purchase_date: new Date().toISOString().split('T')[0],
            refund_date: null,
            refund_amount: 0
        };
        transactions.push(newTransaction);
        return newTransaction;
    }
}

module.exports = TransactionModel;