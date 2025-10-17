import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/transactions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            } else {
                setError('Failed to fetch transactions');
            }
        } catch (error) {
            setError('Error fetching transactions');
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        if (filter === 'completed') return transaction.status === 'completed';
        if (filter === 'refunded') return transaction.status === 'refunded';
        return true;
    });

    const getStatusBadge = (status) => {
        const className = status === 'completed' ? 'status-completed' : 
                         status === 'refunded' ? 'status-refunded' : 'status-pending';
        return <span className={`status-badge ${className}`}>{status}</span>;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) return <div className="loading">Loading transactions...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="transaction-history">
            <div className="transaction-header">
                <h2>Transaction History</h2>
                <div className="filter-controls">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Transactions</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </div>

            <div className="transaction-stats">
                <div className="stat-card">
                    <h3>Total Transactions</h3>
                    <p>{transactions.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p>{formatCurrency(transactions.reduce((sum, t) => sum + t.purchase_amount, 0))}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Refunds</h3>
                    <p>{formatCurrency(transactions.reduce((sum, t) => sum + t.refund_amount, 0))}</p>
                </div>
            </div>

            <div className="transaction-table-container">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>User</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Purchase Date</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Refund Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction.transaction_id}>
                                <td className="transaction-id">{transaction.transaction_id}</td>
                                <td>
                                    <div className="user-info">
                                        <div>{transaction.username}</div>
                                        <div className="user-email">{transaction.email}</div>
                                    </div>
                                </td>
                                <td className="product-name">{transaction.product_name}</td>
                                <td className="amount">{formatCurrency(transaction.purchase_amount)}</td>
                                <td>{new Date(transaction.purchase_date).toLocaleDateString()}</td>
                                <td className="payment-method">{transaction.payment_method.replace('_', ' ')}</td>
                                <td>{getStatusBadge(transaction.status)}</td>
                                <td>
                                    {transaction.refund_status ? (
                                        <div className="refund-info">
                                            <div>{formatCurrency(transaction.refund_amount)}</div>
                                            <div className="refund-date">
                                                {new Date(transaction.refund_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="no-refund">No refund</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
