import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    LinearProgress,
    Avatar,
    Chip,
    Divider,
    Paper
} from '@mui/material';
import {
    TrendingUp,
    People,
    RateReview,
    AccountBalance,
    Receipt,
    AttachMoney,
    Warning,
    CheckCircle
} from '@mui/icons-material';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalReviews: 0,
        totalTransactions: 0,
        totalPayouts: 0,
        totalRevenue: 0,
        totalRefunds: 0,
        pendingReviews: 0,
        fraudReviews: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOverviewStats();
    }, []);

    const fetchOverviewStats = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const [usersRes, reviewsRes, transactionsRes, payoutsRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/admin/reviews', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/admin/transactions', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/admin/payouts', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const [users, reviews, transactions, payouts] = await Promise.all([
                usersRes.json(),
                reviewsRes.json(),
                transactionsRes.json(),
                payoutsRes.json()
            ]);

            const totalRevenue = transactions.reduce((sum, t) => sum + t.purchase_amount, 0);
            const totalRefunds = transactions.reduce((sum, t) => sum + t.refund_amount, 0);
            const pendingReviews = reviews.filter(r => r.payout_status === 'pending').length;
            const fraudReviews = reviews.filter(r => r.payout_status === 'fraud').length;

            setStats({
                totalUsers: users.length,
                totalReviews: reviews.length,
                totalTransactions: transactions.length,
                totalPayouts: payouts.length,
                totalRevenue,
                totalRefunds,
                pendingReviews,
                fraudReviews
            });
        } catch (error) {
            console.error('Error fetching overview stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <LinearProgress />
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
                    Loading dashboard overview...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                📊 Dashboard Overview
            </Typography>
            
            {/* Main Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        height: '100%'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {stats.totalUsers}
                                    </Typography>
                                    <Typography variant="subtitle1">Total Users</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <People fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        height: '100%'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {stats.totalReviews}
                                    </Typography>
                                    <Typography variant="subtitle1">Total Reviews</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <RateReview fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white',
                        height: '100%'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {stats.totalTransactions}
                                    </Typography>
                                    <Typography variant="subtitle1">Transactions</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <Receipt fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        color: 'white',
                        height: '100%'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {stats.totalPayouts}
                                    </Typography>
                                    <Typography variant="subtitle1">Payouts</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <AccountBalance fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Financial Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <AttachMoney sx={{ mr: 1, color: '#4caf50' }} />
                                Financial Overview
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" color="textSecondary">Total Revenue</Typography>
                                    <Typography variant="h5" color="success.main" fontWeight="bold">
                                        {formatCurrency(stats.totalRevenue)}
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={85} 
                                    sx={{ height: 8, borderRadius: 4 }}
                                    color="success"
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" color="textSecondary">Total Refunds</Typography>
                                    <Typography variant="h5" color="error.main" fontWeight="bold">
                                        {formatCurrency(stats.totalRefunds)}
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={25} 
                                    sx={{ height: 8, borderRadius: 4 }}
                                    color="error"
                                />
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" color="textSecondary">Net Revenue</Typography>
                                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                                        {formatCurrency(stats.totalRevenue - stats.totalRefunds)}
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={70} 
                                    sx={{ height: 8, borderRadius: 4 }}
                                    color="primary"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <TrendingUp sx={{ mr: 1, color: '#ff9800' }} />
                                Review Status
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                                        <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                                        <Typography variant="h4" fontWeight="bold" color="success.main">
                                            {stats.totalReviews - stats.pendingReviews - stats.fraudReviews}
                                        </Typography>
                                        <Typography variant="body2">Approved</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                                        <Warning sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                                        <Typography variant="h4" fontWeight="bold" color="warning.main">
                                            {stats.pendingReviews}
                                        </Typography>
                                        <Typography variant="body2">Pending</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
                                        <Typography variant="body2" color="textSecondary">Fraud Detected</Typography>
                                        <Chip 
                                            label={`${stats.fraudReviews} reviews`}
                                            color="error"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardOverview;
