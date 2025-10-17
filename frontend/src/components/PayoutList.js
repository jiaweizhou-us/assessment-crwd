import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    Box,
    Grid,
    Paper,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Fade,
    Zoom,
    Divider,
    LinearProgress,
    Alert,
    Snackbar,
    Badge,
    AppBar,
    Toolbar
} from '@mui/material';
import {
    ThumbUp,
    ThumbDown,
    Flag,
    Visibility,
    Person,
    AttachMoney,
    Warning,
    CheckCircle,
    Cancel,
    Assessment,
    Timeline,
    TrendingUp,
    Security
} from '@mui/icons-material';

const PayoutList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [actionDialog, setActionDialog] = useState({ open: false, action: '', review: null });
    const [rejectReason, setRejectReason] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [stats, setStats] = useState({});
    const [bulkSelected, setBulkSelected] = useState([]);

    useEffect(() => {
        fetchPendingPayouts();
        fetchStats();
    }, []);

    const fetchPendingPayouts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payouts/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(response.data.data || []);
        } catch (error) {
            showSnackbar('Error fetching payouts: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payouts/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.data || {});
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleAction = async (action, reviewId, reason = '') => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : 'flag-fraud';
            const payload = { review_id: reviewId };
            if (reason) payload.reason = reason;

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payouts/${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReviews(reviews.filter(r => r.id !== reviewId));
            showSnackbar(response.data.message, 'success');
            setActionDialog({ open: false, action: '', review: null });
            setRejectReason('');
            fetchStats(); // Refresh stats
        } catch (error) {
            showSnackbar('Error: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleBulkApprove = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payouts/bulk-approve`, {
                review_ids: bulkSelected
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReviews(reviews.filter(r => !bulkSelected.includes(r.id)));
            setBulkSelected([]);
            showSnackbar(`${response.data.results.filter(r => r.success).length} payouts approved`, 'success');
            fetchStats();
        } catch (error) {
            showSnackbar('Error with bulk approval: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const getRiskColor = (score) => {
        if (score > 0.7) return '#f44336'; // Red
        if (score > 0.4) return '#ff9800'; // Orange
        return '#4caf50'; // Green
    };

    const getRiskLevel = (score) => {
        if (score > 0.7) return 'HIGH';
        if (score > 0.4) return 'MEDIUM';
        return 'LOW';
    };

    const toggleBulkSelect = (reviewId) => {
        setBulkSelected(prev => 
            prev.includes(reviewId) 
                ? prev.filter(id => id !== reviewId)
                : [...prev, reviewId]
        );
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
                    Loading pending payouts...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 3
        }}>
            {/* Top Navigation */}
            <AppBar position="static" elevation={0} sx={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
                <Toolbar>
                    <Security sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        CRWD Payout Management
                    </Typography>
                    <Badge badgeContent={reviews.length} color="error">
                        <AttachMoney />
                    </Badge>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 3 }}>
                {/* Stats Dashboard */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Zoom in timeout={500}>
                            <Card sx={{ 
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                color: 'white',
                                borderRadius: 3
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Timeline sx={{ fontSize: 40, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">
                                                {stats.reviews?.pending || 0}
                                            </Typography>
                                            <Typography variant="body2">Pending Reviews</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Zoom in timeout={700}>
                            <Card sx={{ 
                                background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                                color: 'white',
                                borderRadius: 3
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">
                                                ${stats.payouts?.pending_amount?.toFixed(2) || '0.00'}
                                            </Typography>
                                            <Typography variant="body2">Pending Amount</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Zoom in timeout={900}>
                            <Card sx={{ 
                                background: 'linear-gradient(45deg, #FF9800 30%, #F57C00 90%)',
                                color: 'white',
                                borderRadius: 3
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">
                                                {stats.users?.active || 0}
                                            </Typography>
                                            <Typography variant="body2">Active Users</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Zoom in timeout={1100}>
                            <Card sx={{ 
                                background: 'linear-gradient(45deg, #9C27B0 30%, #7B1FA2 90%)',
                                color: 'white',
                                borderRadius: 3
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Assessment sx={{ fontSize: 40, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">
                                                {stats.transactions?.refundRate || 0}%
                                            </Typography>
                                            <Typography variant="body2">Refund Rate</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>
                </Grid>

                {/* Bulk Actions */}
                {bulkSelected.length > 0 && (
                    <Fade in>
                        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, background: 'rgba(255,255,255,0.9)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6">
                                    {bulkSelected.length} reviews selected
                                </Typography>
                                <Box>
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        onClick={handleBulkApprove}
                                        sx={{ mr: 2, borderRadius: 2 }}
                                    >
                                        Bulk Approve
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => setBulkSelected([])}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Clear Selection
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Fade>
                )}

                {/* Reviews List */}
                <Typography variant="h4" sx={{ mb: 3, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    💰 Pending Payouts
                </Typography>

                {reviews.length === 0 ? (
                    <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.9)' }}>
                        <CardContent sx={{ textAlign: 'center', py: 6 }}>
                            <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>All Caught Up!</Typography>
                            <Typography color="textSecondary">No pending payouts at the moment.</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {reviews.map((review, index) => (
                            <Grid item xs={12} md={6} lg={4} key={review.id}>
                                <Fade in timeout={300 * (index + 1)}>
                                    <Card sx={{ 
                                        borderRadius: 3, 
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(20px)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                        },
                                        border: bulkSelected.includes(review.id) ? '2px solid #2196F3' : 'none'
                                    }}>
                                        <CardContent>
                                            {/* Header */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ bgcolor: '#2196F3', mr: 2 }}>
                                                        <Person />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {review.user?.username || review.user_id}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            ID: {review.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton 
                                                    onClick={() => toggleBulkSelect(review.id)}
                                                    color={bulkSelected.includes(review.id) ? 'primary' : 'default'}
                                                >
                                                    <CheckCircle />
                                                </IconButton>
                                            </Box>

                                            {/* Product Info */}
                                            <Paper sx={{ p: 2, mb: 2, borderRadius: 2, background: '#f5f5f5' }}>
                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                    📦 {review.product_name || review.product_id}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                                    "{review.review_text}"
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <Typography variant="body2" sx={{ mr: 1 }}>Rating:</Typography>
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#e0e0e0' }}>
                                                            ⭐
                                                        </span>
                                                    ))}
                                                </Box>
                                            </Paper>

                                            {/* Risk Assessment */}
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="body2" fontWeight="bold">Risk Level</Typography>
                                                    <Chip 
                                                        label={getRiskLevel(review.fraud_score)}
                                                        size="small"
                                                        sx={{ 
                                                            backgroundColor: getRiskColor(review.fraud_score),
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={review.fraud_score * 100}
                                                    sx={{ 
                                                        height: 6, 
                                                        borderRadius: 3,
                                                        backgroundColor: '#e0e0e0',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: getRiskColor(review.fraud_score)
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            {/* Payout Amount */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="body2" color="textSecondary">Payout Amount</Typography>
                                                <Typography variant="h5" fontWeight="bold" color="success.main">
                                                    ${review.payout_amount?.toFixed(2)}
                                                </Typography>
                                            </Box>

                                            {/* Risk Indicators */}
                                            {review.risk_assessment && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={6}>
                                                            <Tooltip title="Previous fraud cases">
                                                                <Chip 
                                                                    icon={<Warning />}
                                                                    label={`Fraud: ${review.risk_assessment.previous_fraud || 0}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Tooltip title="Refund history">
                                                                <Chip 
                                                                    icon={<Cancel />}
                                                                    label={`Refunds: ${review.risk_assessment.refund_history || 0}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </Tooltip>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            )}

                                            <Divider sx={{ my: 2 }} />

                                            {/* Action Buttons */}
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    startIcon={<ThumbUp />}
                                                    onClick={() => handleAction('approve', review.id)}
                                                    sx={{ flex: 1, borderRadius: 2 }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<ThumbDown />}
                                                    onClick={() => setActionDialog({ open: true, action: 'reject', review })}
                                                    sx={{ flex: 1, borderRadius: 2 }}
                                                >
                                                    Reject
                                                </Button>
                                                <Tooltip title="Flag as Fraud">
                                                    <IconButton
                                                        color="warning"
                                                        onClick={() => setActionDialog({ open: true, action: 'fraud', review })}
                                                    >
                                                        <Flag />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => setSelectedReview(review)}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Action Dialog */}
                <Dialog 
                    open={actionDialog.open} 
                    onClose={() => setActionDialog({ open: false, action: '', review: null })}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {actionDialog.action === 'reject' ? '❌ Reject Payout' : '🚨 Flag as Fraud'}
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Are you sure you want to {actionDialog.action} this payout for {actionDialog.review?.user?.username}?
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Reason (required)"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            margin="normal"
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setActionDialog({ open: false, action: '', review: null })}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => handleAction(actionDialog.action, actionDialog.review?.id, rejectReason)}
                            color={actionDialog.action === 'reject' ? 'error' : 'warning'}
                            variant="contained"
                            disabled={!rejectReason.trim()}
                        >
                            Confirm {actionDialog.action === 'reject' ? 'Rejection' : 'Fraud Flag'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Review Details Dialog */}
                <Dialog 
                    open={!!selectedReview} 
                    onClose={() => setSelectedReview(null)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Review Details</DialogTitle>
                    <DialogContent>
                        {selectedReview && (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">User</Typography>
                                        <Typography variant="body1" gutterBottom>{selectedReview.user?.username}</Typography>
                                        
                                        <Typography variant="subtitle2" color="textSecondary">Product</Typography>
                                        <Typography variant="body1" gutterBottom>{selectedReview.product_name}</Typography>
                                        
                                        <Typography variant="subtitle2" color="textSecondary">Review</Typography>
                                        <Typography variant="body1" gutterBottom>"{selectedReview.review_text}"</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Payout Amount</Typography>
                                        <Typography variant="h5" color="success.main" gutterBottom>
                                            ${selectedReview.payout_amount?.toFixed(2)}
                                        </Typography>
                                        
                                        <Typography variant="subtitle2" color="textSecondary">Fraud Score</Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {(selectedReview.fraud_score * 100).toFixed(1)}%
                                        </Typography>
                                        
                                        <Typography variant="subtitle2" color="textSecondary">Created</Typography>
                                        <Typography variant="body1">{selectedReview.created_at}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedReview(null)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default PayoutList;