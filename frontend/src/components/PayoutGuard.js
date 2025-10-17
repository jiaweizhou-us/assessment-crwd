import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Box,
    Grid,
    Paper,
    Chip,
    Avatar,
    LinearProgress,
    Alert,
    Snackbar,
    Fade,
    Zoom,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    AppBar,
    Toolbar,
    Tab,
    Tabs,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Security,
    AttachMoney,
    CheckCircle,
    Cancel,
    Assessment,
    History,
    Visibility,
    Add,
    Search,
    Star,
    ShoppingCart,
    Timeline,
} from '@mui/icons-material';

const PayoutGuard = () => {
    const [formData, setFormData] = useState({
        user_id: '',
        product_id: '',
        transaction_id: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [selectedTab, setSelectedTab] = useState(0);
    const [userReviews, setUserReviews] = useState([]);
    const [reviewDialog, setReviewDialog] = useState({ open: false });
    const [reviewDetailsDialog, setReviewDetailsDialog] = useState({ open: false, review: null });
    const [newReview, setNewReview] = useState({
        product_id: '',
        product_name: '',
        review_text: '',
        rating: 5,
        payout_amount: 25.00
    });

    useEffect(() => {
        if (selectedTab === 1) {
            fetchUserReviews();
        }
    }, [selectedTab]);

    const fetchUserReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showSnackbar('Please log in to view your reviews', 'error');
                return;
            }
            
            const response = await axios.get('http://localhost:5000/api/my-reviews', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserReviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            showSnackbar('Error fetching reviews: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleNewReviewChange = (field) => (e) => {
        setNewReview(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/check-refund-status', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setResult(response.data);
            showSnackbar('Status check completed', 'success');
        } catch (error) {
            const errorData = error.response?.data;
            setResult(errorData || { 
                success: false, 
                status: 'Error', 
                message: error.message,
                payout_status: false 
            });
            showSnackbar('Error checking status: ' + (errorData?.message || error.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showSnackbar('Please log in to submit a review', 'error');
                return;
            }

            // Validate required fields
            if (!newReview.product_id.trim() || !newReview.review_text.trim()) {
                showSnackbar('Please fill in all required fields', 'error');
                return;
            }

            await axios.post('http://localhost:5000/api/submit-review', newReview, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showSnackbar('Review submitted successfully!', 'success');
            setReviewDialog({ open: false });
            setNewReview({
                product_id: '',
                product_name: '',
                review_text: '',
                rating: 5,
                payout_amount: 25.00
            });
            fetchUserReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            showSnackbar('Error submitting review: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleViewReviewDetails = (review) => {
        setReviewDetailsDialog({ open: true, review });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Payout Approved': return 'success';
            case 'Under Review': return 'warning';
            case 'Payout Denied': return 'error';
            case 'Account Flagged': return 'error';
            default: return 'info';
        }
    };

    const getPayoutStatusChip = (status) => {
        const colors = {
            'pending': { color: 'warning', label: 'Pending Review' },
            'approved': { color: 'success', label: 'Approved' },
            'rejected': { color: 'error', label: 'Rejected' },
            'fraud': { color: 'error', label: 'Fraud Detected' }
        };
        
        const config = colors[status] || { color: 'default', label: status };
        return <Chip label={config.label} color={config.color} size="small" />;
    };

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
                        🔐 CRWD Payout Guard
                    </Typography>
                    <AttachMoney />
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 3 }}>
                {/* Tabs */}
                <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.95)', mb: 3 }}>
                    <Tabs 
                        value={selectedTab} 
                        onChange={(e, newValue) => setSelectedTab(newValue)}
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="🔍 Check Payout Status" icon={<Search />} />
                        <Tab label="📝 My Reviews" icon={<History />} />
                    </Tabs>

                    {/* Check Payout Status Tab */}
                    {selectedTab === 0 && (
                        <CardContent>
                            <Fade in timeout={800}>
                                <Box>
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <Security sx={{ fontSize: 80, color: '#2196F3', mb: 2 }} />
                                        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                            Check Your Payout Status
                                        </Typography>
                                        <Typography variant="h6" color="textSecondary">
                                            Verify refund status and payout eligibility
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Search sx={{ mr: 1 }} />
                                                    Status Check Form
                                                </Typography>
                                                
                                                <form onSubmit={handleSubmit}>
                                                    <TextField
                                                        label="User ID"
                                                        fullWidth
                                                        value={formData.user_id}
                                                        onChange={handleInputChange('user_id')}
                                                        required
                                                        margin="normal"
                                                        variant="outlined"
                                                        disabled={loading}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                        helperText="Enter your unique user identifier"
                                                    />
                                                    <TextField
                                                        label="Product ID"
                                                        fullWidth
                                                        value={formData.product_id}
                                                        onChange={handleInputChange('product_id')}
                                                        required
                                                        margin="normal"
                                                        variant="outlined"
                                                        disabled={loading}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                        helperText="Product identifier from your purchase"
                                                    />
                                                    <TextField
                                                        label="Transaction ID"
                                                        fullWidth
                                                        value={formData.transaction_id}
                                                        onChange={handleInputChange('transaction_id')}
                                                        required
                                                        margin="normal"
                                                        variant="outlined"
                                                        disabled={loading}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                        helperText="Transaction ID from your purchase receipt"
                                                    />
                                                    
                                                    <Button
                                                        type="submit"
                                                        fullWidth
                                                        variant="contained"
                                                        disabled={loading}
                                                        sx={{
                                                            mt: 3,
                                                            height: 56,
                                                            borderRadius: 2,
                                                            fontSize: '1.1rem',
                                                            fontWeight: 'bold',
                                                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(45deg, #1976D2 30%, #1BA5D2 90%)',
                                                            }
                                                        }}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <LinearProgress sx={{ width: 24, mr: 2 }} />
                                                                Checking...
                                                            </>
                                                        ) : (
                                                            '🔍 Check Payout Status'
                                                        )}
                                                    </Button>
                                                </form>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            {result ? (
                                                <Zoom in timeout={600}>
                                                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%', mt: 4 }}>
                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Assessment sx={{ mr: 1 }} />
                                                            Status Result
                                                        </Typography>

                                                        <Alert 
                                                            severity={getStatusColor(result.status)} 
                                                            sx={{ mb: 3, borderRadius: 2 }}
                                                            icon={result.payout_status ? <CheckCircle /> : <Cancel />}
                                                        >
                                                            <Typography variant="h6" fontWeight="bold">
                                                                {result.status}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {result.message}
                                                            </Typography>
                                                        </Alert>

                                                        {result.details && (
                                                            <Box>
                                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                                    📊 Details
                                                                </Typography>
                                                                
                                                                {result.details.transaction && (
                                                                    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                                                                        <Typography variant="subtitle2" gutterBottom>
                                                                            🛒 Transaction Info
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            Product: {result.details.transaction.product_name}
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            Purchase Amount: ${result.details.transaction.purchase_amount}
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            Refunded: {result.details.transaction.refund_status ? '✅ Yes' : '❌ No'}
                                                                        </Typography>
                                                                    </Paper>
                                                                )}

                                                                {result.details.review && (
                                                                    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                                                                        <Typography variant="subtitle2" gutterBottom>
                                                                            ⭐ Review Info
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            Status: {getPayoutStatusChip(result.details.review.payout_status)}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                                                            Rating: {[...Array(result.details.review.rating)].map((_, i) => '⭐').join('')}
                                                                        </Typography>
                                                                        {result.details.payout_amount && (
                                                                            <Typography variant="h6" color="success.main" sx={{ mt: 1 }}>
                                                                                💰 ${result.details.payout_amount}
                                                                            </Typography>
                                                                        )}
                                                                    </Paper>
                                                                )}

                                                                {result.details.risk_assessment && (
                                                                    <Paper sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2 }}>
                                                                        <Typography variant="subtitle2" gutterBottom>
                                                                            ⚠️ Risk Assessment
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                            <Chip 
                                                                                size="small" 
                                                                                label={`Fraud Score: ${(result.details.risk_assessment.fraud_score * 100).toFixed(0)}%`}
                                                                                color={result.details.risk_assessment.fraud_score > 0.5 ? 'error' : 'success'}
                                                                            />
                                                                            <Chip 
                                                                                size="small" 
                                                                                label={`Refunds: ${result.details.risk_assessment.refund_history}`}
                                                                                variant="outlined"
                                                                            />
                                                                            <Chip 
                                                                                size="small" 
                                                                                label={`Account Age: ${result.details.risk_assessment.account_age_days}d`}
                                                                                variant="outlined"
                                                                            />
                                                                        </Box>
                                                                    </Paper>
                                                                )}
                                                            </Box>
                                                        )}
                                                    </Paper>
                                                </Zoom>
                                            ) : (
                                                <Paper sx={{ 
                                                    p: 4, 
                                                    mt: 4,
                                                    borderRadius: 3, 
                                                    height: '100%', 
                                                    display: 'flex', 
                                                    flexDirection: 'column',
                                                    alignItems: 'center', 
                                                    justifyContent: 'flex-start',
                                                    textAlign: 'center',
                                                    backgroundColor: '#fafafa',
                                                    border: '2px dashed #e0e0e0',
                                                    minHeight: 400,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    pt: 6,
                                                }}>
                                                    <Box sx={{ 
                                                        position: 'relative',
                                                        zIndex: 2,
                                                        maxWidth: 280,
                                                    }}>
                                                        <Timeline sx={{ 
                                                            fontSize: 100, 
                                                            color: '#bdbdbd', 
                                                            mb: 3,
                                                            opacity: 0.8
                                                        }} />
                                                        <Typography variant="h5" color="textSecondary" gutterBottom fontWeight={600}>
                                                            Results will appear here
                                                        </Typography>
                                                        <Typography variant="body1" color="textSecondary" sx={{ 
                                                            lineHeight: 1.6,
                                                            opacity: 0.8
                                                        }}>
                                                            Fill out the form on the left and click "Check Payout Status" to see your results
                                                        </Typography>
                                                    </Box>
                                                    
                                                    {/* Decorative background elements */}
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: 20,
                                                        right: 20,
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
                                                        opacity: 0.3,
                                                        zIndex: 1
                                                    }} />
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        bottom: 30,
                                                        left: 30,
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(45deg, #f3e5f5, #e1bee7)',
                                                        opacity: 0.3,
                                                        zIndex: 1
                                                    }} />
                                                </Paper>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Fade>
                        </CardContent>
                    )}

                    {/* My Reviews Tab */}
                    {selectedTab === 1 && (
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" fontWeight="bold">
                                    📝 My Review History
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => setReviewDialog({ open: true })}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Submit New Review
                                </Button>
                            </Box>

                            {userReviews.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <Star sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
                                    <Typography variant="h6" color="textSecondary" gutterBottom>
                                        No reviews yet
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Submit your first product review to start earning payouts!
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Review</TableCell>
                                                <TableCell>Rating</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {userReviews.map((review) => (
                                                <TableRow key={review.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                                                                <ShoppingCart />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    {review.product_name}
                                                                </Typography>
                                                                <Typography variant="caption" color="textSecondary">
                                                                    ID: {review.product_id}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            "{review.review_text}"
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star 
                                                                    key={i} 
                                                                    sx={{ 
                                                                        fontSize: 16,
                                                                        color: i < review.rating ? '#ffc107' : '#e0e0e0' 
                                                                    }} 
                                                                />
                                                            ))}
                                                            <Typography variant="body2" sx={{ ml: 1 }}>
                                                                {review.rating}/5
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getPayoutStatusChip(review.payout_status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight="bold" color="success.main">
                                                            ${review.payout_amount?.toFixed(2)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {review.created_at}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title="View Details">
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => handleViewReviewDetails(review)}
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    )}
                </Card>

                {/* Submit Review Dialog */}
                <Dialog 
                    open={reviewDialog.open} 
                    onClose={() => setReviewDialog({ open: false })}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>📝 Submit New Review</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Product ID"
                            value={newReview.product_id}
                            onChange={handleNewReviewChange('product_id')}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Product Name"
                            value={newReview.product_name}
                            onChange={handleNewReviewChange('product_name')}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Review Text"
                            value={newReview.review_text}
                            onChange={handleNewReviewChange('review_text')}
                            margin="normal"
                            required
                            helperText="Share your honest experience with this product"
                        />
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <TextField
                                type="number"
                                label="Rating (1-5)"
                                value={newReview.rating}
                                onChange={handleNewReviewChange('rating')}
                                inputProps={{ min: 1, max: 5 }}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                type="number"
                                label="Expected Payout ($)"
                                value={newReview.payout_amount}
                                onChange={handleNewReviewChange('payout_amount')}
                                inputProps={{ min: 0, step: 0.01 }}
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setReviewDialog({ open: false })}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmitReview}
                            variant="contained"
                            disabled={!newReview.product_id || !newReview.review_text}
                        >
                            Submit Review
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Review Details Dialog */}
                <Dialog 
                    open={reviewDetailsDialog.open} 
                    onClose={() => setReviewDetailsDialog({ open: false, review: null })}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Visibility />
                        Review Details
                    </DialogTitle>
                    <DialogContent>
                        {reviewDetailsDialog.review && (
                            <Box sx={{ mt: 2 }}>
                                {/* Product Information */}
                                <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ShoppingCart sx={{ mr: 1 }} />
                                        Product Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="textSecondary">Product Name</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {reviewDetailsDialog.review.product_name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="textSecondary">Product ID</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {reviewDetailsDialog.review.product_id}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Review Content */}
                                <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Star sx={{ mr: 1 }} />
                                        Review Content
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>Rating</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    sx={{ 
                                                        fontSize: 24,
                                                        color: i < reviewDetailsDialog.review.rating ? '#ffc107' : '#e0e0e0' 
                                                    }} 
                                                />
                                            ))}
                                            <Typography variant="h6" sx={{ ml: 1 }}>
                                                {reviewDetailsDialog.review.rating}/5
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>Review Text</Typography>
                                        <Paper sx={{ p: 2, backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
                                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                                "{reviewDetailsDialog.review.review_text}"
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </Paper>

                                {/* Payout Information */}
                                <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AttachMoney sx={{ mr: 1 }} />
                                        Payout Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="textSecondary">Payout Status</Typography>
                                            <Box sx={{ mt: 1 }}>
                                                {getPayoutStatusChip(reviewDetailsDialog.review.payout_status)}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="textSecondary">Payout Amount</Typography>
                                            <Typography variant="h5" color="success.main" fontWeight="bold">
                                                ${reviewDetailsDialog.review.payout_amount?.toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Submission Details */}
                                <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <History sx={{ mr: 1 }} />
                                        Submission Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="textSecondary">Submitted Date</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {reviewDetailsDialog.review.created_at}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="textSecondary">Review ID</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {reviewDetailsDialog.review.id}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setReviewDetailsDialog({ open: false, review: null })}>
                            Close
                        </Button>
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

export default PayoutGuard;