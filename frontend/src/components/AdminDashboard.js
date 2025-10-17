import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Grid,
    Paper,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Alert,
    Snackbar,
    LinearProgress,
    Avatar,
    Tooltip,
    AppBar,
    Toolbar,
    Badge,
    Fade,
    Zoom
} from '@mui/material';
import {
    Dashboard,
    Warning,
    Security,
    People,
    Assessment,
    Flag,
    Block,
    CheckCircle,
    Visibility,
    TrendingUp,
    TrendingDown,
    AttachMoney,
    ShoppingCart,
    Person,
    Cancel,
    MonetizationOn,
    BarChart,
    PieChart,
    Timeline
} from '@mui/icons-material';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({});
    const [flaggedReviews, setFlaggedReviews] = useState([]);
    const [flaggedUsers, setFlaggedUsers] = useState([]);
    const [eligibleUsers, setEligibleUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [flagDialog, setFlagDialog] = useState({ open: false, user: null });
    const [flagReason, setFlagReason] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchDashboardData();
        fetchFlaggedReviews();
        fetchFlaggedUsers();
        fetchEligibleUsers();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/ops/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDashboardData(response.data.data || {});
        } catch (error) {
            showSnackbar('Error fetching dashboard data: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchFlaggedReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/ops/flagged-reviews', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFlaggedReviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching flagged reviews:', error);
        }
    };

    const fetchFlaggedUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/ops/flagged-users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFlaggedUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching flagged users:', error);
        }
    };

    const fetchEligibleUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/ops/eligible-users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEligibleUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching eligible users:', error);
        }
    };

    const handleFlagUser = async (userId, reason) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/ops/flag-user', {
                user_id: userId,
                reason: reason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            showSnackbar('User flagged successfully', 'success');
            setFlagDialog({ open: false, user: null });
            setFlagReason('');
            fetchFlaggedUsers();
            fetchEligibleUsers();
            fetchDashboardData();
        } catch (error) {
            showSnackbar('Error flagging user: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleUnflagUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/ops/unflag-user', {
                user_id: userId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            showSnackbar('User unflagged successfully', 'success');
            fetchFlaggedUsers();
            fetchEligibleUsers();
            fetchDashboardData();
        } catch (error) {
            showSnackbar('Error unflagging user: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case 'HIGH': return '#f44336';
            case 'MEDIUM': return '#ff9800';
            case 'LOW': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
                    Loading admin dashboard...
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
                    <Dashboard sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        🔐 CRWD Admin Dashboard
                    </Typography>
                    <Badge badgeContent={dashboardData.summary?.flagged_reviews || 0} color="error">
                        <Warning />
                    </Badge>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 3 }}>
                {/* Key Metrics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Zoom in timeout={500}>
                            <Card sx={{ 
                                background: 'linear-gradient(45deg, #f44336 30%, #e53935 90%)',
                                color: 'white',
                                borderRadius: 3
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Flag sx={{ fontSize: 40, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">
                                                {dashboardData.summary?.flagged_reviews || 0}
                                            </Typography>
                                            <Typography variant="body2">Flagged Reviews</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Zoom in timeout={700}>
                            <Card sx={{ 
                                background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
                                color: 'white',
                                borderRadius: 3
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Warning sx={{ fontSize: 40, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">
                                                {dashboardData.summary?.high_risk_pending || 0}
                                            </Typography>
                                            <Typography variant="body2">High Risk Pending</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Zoom in timeout={900}>
                            <Card sx={{ 
                                background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
                                color: 'white',
                                borderRadius: 3
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <People sx={{ fontSize: 40, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">
                                                {dashboardData.summary?.suspicious_users || 0}
                                            </Typography>
                                            <Typography variant="body2">Suspicious Users</Typography>
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
                                        <TrendingDown sx={{ fontSize: 40, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">
                                                {dashboardData.summary?.refund_rate || 0}%
                                            </Typography>
                                            <Typography variant="body2">Refund Rate</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>
                </Grid>

                {/* Detailed Analytics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <BarChart sx={{ mr: 1 }} />
                                    Review Statistics
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h3" color="primary" fontWeight="bold">
                                                {dashboardData.stats?.reviews?.total || 0}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">Total Reviews</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h3" color="success.main" fontWeight="bold">
                                                {dashboardData.stats?.reviews?.approved || 0}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">Approved</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h3" color="warning.main" fontWeight="bold">
                                                {dashboardData.stats?.reviews?.pending || 0}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">Pending</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h3" color="error.main" fontWeight="bold">
                                                {dashboardData.stats?.reviews?.fraud || 0}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">Fraud</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AttachMoney sx={{ mr: 1 }} />
                                    Financial Overview
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="body2">Total Paid Out</Typography>
                                            <Typography variant="h5" color="success.main" fontWeight="bold">
                                                ${dashboardData.stats?.users?.totalEarnings || 0}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="body2">Transaction Volume</Typography>
                                            <Typography variant="h5" color="primary" fontWeight="bold">
                                                ${dashboardData.stats?.transactions?.totalPurchaseAmount || 0}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2">Total Refunded</Typography>
                                            <Typography variant="h5" color="error.main" fontWeight="bold">
                                                ${dashboardData.stats?.transactions?.totalRefundAmount || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabs Section */}
                <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
                    <Tabs 
                        value={selectedTab} 
                        onChange={(e, newValue) => setSelectedTab(newValue)}
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="🚨 Flagged Reviews" />
                        <Tab label="👥 Eligible Users" />
                        <Tab label="⚠️ Flagged Users" />
                    </Tabs>

                    {/* Flagged Reviews Tab */}
                    {selectedTab === 0 && (
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Flagged Reviews</Typography>
                            {flaggedReviews.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                                    <Typography variant="h6" color="textSecondary">No flagged reviews</Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>User</TableCell>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Review</TableCell>
                                                <TableCell>Fraud Score</TableCell>
                                                <TableCell>Reason</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {flaggedReviews.map((review) => (
                                                <TableRow key={review.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ bgcolor: 'error.main', mr: 1, width: 32, height: 32 }}>
                                                                <Person />
                                                            </Avatar>
                                                            {review.user_info?.username || review.user_id}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{review.product_name}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            "{review.review_text}"
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={review.fraud_score * 100}
                                                            sx={{ width: 60, mr: 1 }}
                                                            color="error"
                                                        />
                                                        {(review.fraud_score * 100).toFixed(0)}%
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={review.fraud_reason || 'Manual flag'}
                                                            color="error"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title="View Details">
                                                            <IconButton size="small">
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

                    {/* Eligible Users Tab */}
                    {selectedTab === 1 && (
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Users Eligible for Payouts</Typography>
                            {eligibleUsers.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <MonetizationOn sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                                    <Typography variant="h6" color="textSecondary">No eligible users</Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {eligibleUsers.map((user, index) => (
                                        <Grid item xs={12} md={6} lg={4} key={user.user_info?.id || index}>
                                            <Fade in timeout={300 * (index + 1)}>
                                                <Card sx={{ 
                                                    borderRadius: 2,
                                                    border: `2px solid ${getRiskColor(user.risk_level)}`,
                                                    '&:hover': { boxShadow: 3 }
                                                }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                                    <Person />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="h6" fontWeight="bold">
                                                                        {user.user_info?.username}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="textSecondary">
                                                                        {user.pending_reviews?.length} pending reviews
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Chip 
                                                                label={user.risk_level}
                                                                size="small"
                                                                sx={{ 
                                                                    backgroundColor: getRiskColor(user.risk_level),
                                                                    color: 'white',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            />
                                                        </Box>

                                                        <Box sx={{ mb: 2 }}>
                                                            <Typography variant="body2" color="textSecondary">Total Pending Amount</Typography>
                                                            <Typography variant="h5" color="success.main" fontWeight="bold">
                                                                ${user.total_pending_amount?.toFixed(2)}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ mb: 2 }}>
                                                            <Typography variant="body2" color="textSecondary" gutterBottom>Risk Indicators</Typography>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={6}>
                                                                    <Chip 
                                                                        icon={<Cancel />}
                                                                        label={`Refunds: ${user.risk_assessment?.refunds_count || 0}`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Chip 
                                                                        icon={<Warning />}
                                                                        label={`Fraud: ${user.risk_assessment?.previous_fraud || 0}`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Button 
                                                                size="small" 
                                                                variant="outlined"
                                                                onClick={() => setSelectedUser(user)}
                                                                sx={{ flex: 1 }}
                                                            >
                                                                View Details
                                                            </Button>
                                                            <Button 
                                                                size="small" 
                                                                variant="contained"
                                                                color="error"
                                                                onClick={() => setFlagDialog({ open: true, user })}
                                                            >
                                                                Flag User
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Fade>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    )}

                    {/* Flagged Users Tab */}
                    {selectedTab === 2 && (
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Flagged Users</Typography>
                            {flaggedUsers.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Security sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                                    <Typography variant="h6" color="textSecondary">No flagged users</Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>User</TableCell>
                                                <TableCell>Reason</TableCell>
                                                <TableCell>Reviews</TableCell>
                                                <TableCell>Transactions</TableCell>
                                                <TableCell>Flagged Date</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {flaggedUsers.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ bgcolor: 'error.main', mr: 1 }}>
                                                                <Block />
                                                            </Avatar>
                                                            {user.username}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{user.flag_reason}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            Total: {user.reviews?.total || 0} | 
                                                            Fraud: {user.reviews?.fraud || 0}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            Total: {user.transactions?.total || 0} | 
                                                            Refunded: {user.transactions?.refunded || 0}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{user.flagged_at}</TableCell>
                                                    <TableCell>
                                                        <Button 
                                                            size="small" 
                                                            variant="contained" 
                                                            color="success"
                                                            onClick={() => handleUnflagUser(user.id)}
                                                        >
                                                            Unflag
                                                        </Button>
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

                {/* Flag User Dialog */}
                <Dialog 
                    open={flagDialog.open} 
                    onClose={() => setFlagDialog({ open: false, user: null })}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>🚨 Flag User</DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Flag user: {flagDialog.user?.user_info?.username}
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Reason for flagging (required)"
                            value={flagReason}
                            onChange={(e) => setFlagReason(e.target.value)}
                            margin="normal"
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setFlagDialog({ open: false, user: null })}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => handleFlagUser(flagDialog.user?.user_info?.id, flagReason)}
                            color="error"
                            variant="contained"
                            disabled={!flagReason.trim()}
                        >
                            Flag User
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* User Details Dialog */}
                <Dialog 
                    open={!!selectedUser} 
                    onClose={() => setSelectedUser(null)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>User Details</DialogTitle>
                    <DialogContent>
                        {selectedUser && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Username</Typography>
                                    <Typography variant="body1" gutterBottom>{selectedUser.user_info?.username}</Typography>
                                    
                                    <Typography variant="subtitle2" color="textSecondary">Total Earned</Typography>
                                    <Typography variant="body1" gutterBottom>${selectedUser.user_info?.total_earned}</Typography>
                                    
                                    <Typography variant="subtitle2" color="textSecondary">Reviews Completed</Typography>
                                    <Typography variant="body1" gutterBottom>{selectedUser.user_info?.reviews_completed}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Pending Amount</Typography>
                                    <Typography variant="h5" color="success.main" gutterBottom>
                                        ${selectedUser.total_pending_amount?.toFixed(2)}
                                    </Typography>
                                    
                                    <Typography variant="subtitle2" color="textSecondary">Risk Score</Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {(selectedUser.risk_score * 100).toFixed(1)}% ({selectedUser.risk_level})
                                    </Typography>
                                    
                                    <Typography variant="subtitle2" color="textSecondary">Account Age</Typography>
                                    <Typography variant="body1">
                                        {selectedUser.risk_assessment?.account_age_days} days
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedUser(null)}>Close</Button>
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

export default AdminDashboard;