import React, { useState, useEffect } from 'react';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/reviews', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                console.error('Failed to fetch reviews:', response.status, response.statusText);
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            // Only show empty array on network error, don't use mock data in production
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' },
            approved: { backgroundColor: '#d1ecf1', color: '#0c5460', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' },
            rejected: { backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' },
            paid: { backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }
        };
        return styles[status] || styles.pending;
    };

    const getRatingStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const filteredReviews = reviews.filter(review => {
        const matchesFilter = filter === 'all' || review.payout_status === filter;
        const matchesSearch = review.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            review.user_id.toString().includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    const handleViewReview = (review) => {
        setSelectedReview(review);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => setSelectedReview(null), 300); // Wait for animation to complete
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
                <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 2s linear infinite' }}></div>
                <p style={{ marginTop: '10px' }}>Loading reviews...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, color: '#333', fontSize: '28px' }}>
                    📊 Review Management
                </h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center', minWidth: '100px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>{reviews.length}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Total Reviews</div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center', minWidth: '100px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>{reviews.filter(r => r.payout_status === 'pending').length}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Pending</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                    />
                </div>
                
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{marginLeft: '10px', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white' }}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="paid">Paid</option>
                </select>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {filteredReviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📝</div>
                        <h3 style={{ marginBottom: '5px' }}>No reviews found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '2px solid #dee2e6' }}>ID</th>
                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '2px solid #dee2e6' }}>User</th>
                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '2px solid #dee2e6' }}>Product</th>
                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '2px solid #dee2e6' }}>Rating</th>
                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '2px solid #dee2e6' }}>Status</th>
                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.map(review => (
                                <tr key={review.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px', fontWeight: '600', color: '#333' }}>#{review.id}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#007bff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                                                {review.user_id.toString().charAt(0)}
                                            </div>
                                            <span>User {review.user_id}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: '500' }}>{review.product_name}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ color: '#ffa500', marginRight: '5px' }}>{getRatingStars(review.rating)}</span>
                                        <span style={{ color: '#666', fontSize: '12px' }}>({review.rating})</span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={getStatusBadge(review.payout_status)}>
                                            {review.payout_status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button 
                                                onClick={() => handleViewReview(review)}
                                                style={{ 
                                                    padding: '8px 12px', 
                                                    border: 'none', 
                                                    borderRadius: '6px', 
                                                    backgroundColor: '#007bff', 
                                                    color: 'white', 
                                                    cursor: 'pointer', 
                                                    fontSize: '14px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 2px 4px rgba(0,123,255,0.2)'
                                                }} 
                                                title="View Details"
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#0056b3';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#007bff';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 2px 4px rgba(0,123,255,0.2)';
                                                }}
                                            >
                                                👁️ View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Animated Review Details Modal */}
            {(showModal || selectedReview) && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: showModal ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        transition: 'background-color 0.3s ease',
                        backdropFilter: showModal ? 'blur(5px)' : 'blur(0px)'
                    }}
                    onClick={closeModal}
                >
                    <div 
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '30px',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '85vh',
                            overflow: 'auto',
                            transform: showModal ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(-50px)',
                            opacity: showModal ? 1 : 0,
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedReview && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h3 style={{ 
                                        margin: 0, 
                                        color: '#333', 
                                        fontSize: '24px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        📋 Review Details
                                    </h3>
                                    <button 
                                        onClick={closeModal}
                                        style={{ 
                                            background: '#f8f9fa', 
                                            border: 'none', 
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            fontSize: '18px', 
                                            cursor: 'pointer',
                                            color: '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#e9ecef';
                                            e.target.style.transform = 'rotate(90deg)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#f8f9fa';
                                            e.target.style.transform = 'rotate(0deg)';
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                <div style={{ lineHeight: '1.6' }}>
                                    <div style={{ 
                                        marginBottom: '20px', 
                                        padding: '15px', 
                                        backgroundColor: '#f8f9ff', 
                                        borderRadius: '10px',
                                        border: '1px solid #e3e6ff'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <strong style={{ color: '#4c6ef5' }}>Review ID:</strong> 
                                            <span style={{ 
                                                backgroundColor: '#4c6ef5', 
                                                color: 'white', 
                                                padding: '4px 8px', 
                                                borderRadius: '6px', 
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                #{selectedReview.id}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <strong style={{ color: '#4c6ef5' }}>User:</strong>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ 
                                                    width: '25px', 
                                                    height: '25px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: '#4c6ef5', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    color: 'white', 
                                                    fontSize: '10px', 
                                                    fontWeight: 'bold' 
                                                }}>
                                                    {selectedReview.user_id.toString().charAt(0)}
                                                </div>
                                                <span>User {selectedReview.user_id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <strong style={{ color: '#333', fontSize: '16px' }}>Product:</strong>
                                        <p style={{ 
                                            margin: '8px 0', 
                                            fontSize: '18px', 
                                            fontWeight: '500',
                                            color: '#2d3436'
                                        }}>
                                            {selectedReview.product_name}
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <strong style={{ color: '#333', fontSize: '16px' }}>Rating:</strong>
                                        <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ 
                                                color: '#ffa500', 
                                                fontSize: '24px',
                                                textShadow: '0 2px 4px rgba(255,165,0,0.3)'
                                            }}>
                                                {getRatingStars(selectedReview.rating)}
                                            </span>
                                            <span style={{ 
                                                backgroundColor: '#fff3e0', 
                                                color: '#f57c00', 
                                                padding: '4px 8px', 
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}>
                                                {selectedReview.rating}/5
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <strong style={{ color: '#333', fontSize: '16px' }}>Status:</strong>
                                        <div style={{ margin: '8px 0' }}>
                                            <span style={{ 
                                                ...getStatusBadge(selectedReview.payout_status), 
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {selectedReview.payout_status}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedReview.review_text && (
                                        <div style={{ marginBottom: '20px' }}>
                                            <strong style={{ color: '#333', fontSize: '16px' }}>Review Text:</strong>
                                            <div style={{ 
                                                backgroundColor: '#f8f9fa', 
                                                padding: '15px', 
                                                borderRadius: '10px', 
                                                marginTop: '8px',
                                                border: '1px solid #dee2e6',
                                                borderLeft: '4px solid #007bff'
                                            }}>
                                                <p style={{ margin: 0, lineHeight: '1.6', color: '#495057' }}>
                                                    "{selectedReview.review_text}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedReview.purchase_date && (
                                        <div style={{ marginBottom: '20px' }}>
                                            <strong style={{ color: '#333', fontSize: '16px' }}>Purchase Date:</strong>
                                            <p style={{ 
                                                margin: '8px 0', 
                                                color: '#6c757d',
                                                fontSize: '15px'
                                            }}>
                                                📅 {new Date(selectedReview.purchase_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    {selectedReview.payout_amount && (
                                        <div style={{ marginBottom: '20px' }}>
                                            <strong style={{ color: '#333', fontSize: '16px' }}>Payout Amount:</strong>
                                            <p style={{ 
                                                margin: '8px 0', 
                                                fontSize: '20px', 
                                                fontWeight: 'bold',
                                                color: '#28a745'
                                            }}>
                                                💰 ${selectedReview.payout_amount}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewManagement;