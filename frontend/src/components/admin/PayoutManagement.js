import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    LinearProgress,
    MenuItem,
    Tooltip,
    Avatar,
    Button,
    Grid,
    Paper
} from '@mui/material';
import {
    Search,
    Visibility,
    CheckCircle,
    Pending,
    AccountBalance,
    Person,
    AttachMoney,
    Schedule,
    PaymentOutlined
} from '@mui/icons-material';

const PayoutManagement = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [stats, setStats] = useState({
        totalPayouts: 0,
        completedPayouts: 0,
        pendingPayouts: 0,
        totalAmount: 0
    });

    useEffect(() => {
        fetchPayouts();
    }, []);

    const fetchPayouts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/payouts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setPayouts(data);
                
                // Calculate stats
                const totalAmount = data.reduce((sum, payout) => sum + payout.amount, 0);
                const completedPayouts = data.filter(p => p.status === 'completed').length;
                const pendingPayouts = data.filter(p => p.status === 'pending').length;
                
                setStats({
                    totalPayouts: data.length,
                    completedPayouts,
                    pendingPayouts,
                    totalAmount
                });
            }
        } catch (error) {
            console.error('Error fetching payouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPayouts = payouts.filter(payout => {
        const matchesSearch = payout.user_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            case 'processing': return 'info';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle />;
            case 'pending': return <Pending />;
            case 'processing': return <Schedule />;
            default: return null;
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
                    Loading payouts...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                💰 Payout Management
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                        <AccountBalance sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            {stats.totalPayouts}
                        </Typography>
                        <Typography variant="body2">Total Payouts</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                        <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                            {stats.completedPayouts}
                        </Typography>
                        <Typography variant="body2">Completed</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                        <Pending sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="warning.main">
                            {stats.pendingPayouts}
                        </Typography>
                        <Typography variant="body2">Pending</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                        <AttachMoney sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="secondary.main">
                            {formatCurrency(stats.totalAmount)}
                        </Typography>
                        <Typography variant="body2">Total Amount</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Search and Filter Controls */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            placeholder="Search payouts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flexGrow: 1 }}
                        />
                        <TextField
                            select
                            label="Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="failed">Failed</MenuItem>
                        </TextField>
                    </Box>
                </CardContent>
            </Card>

            {/* Payouts Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Payout ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Approved Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Paid Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPayouts.map((payout) => (
                                <TableRow key={payout.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            #{payout.id}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Review #{payout.review_id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 32, height: 32 }}>
                                                <Person />
                                            </Avatar>
                                            <Typography variant="body2">
                                                {payout.user_id}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6" color="success.main" fontWeight="bold">
                                            {formatCurrency(payout.amount)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={payout.status}
                                            color={getStatusColor(payout.status)}
                                            size="small"
                                            icon={getStatusIcon(payout.status)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PaymentOutlined sx={{ mr: 1, color: '#666' }} />
                                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                {payout.payment_method || 'PayPal'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {payout.approved_at ? 
                                            new Date(payout.approved_at).toLocaleDateString() : 
                                            'Not approved'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {payout.paid_at ? 
                                            new Date(payout.paid_at).toLocaleDateString() : 
                                            'Not paid'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="View Details">
                                            <IconButton color="primary" size="small">
                                                <Visibility />
                                            </IconButton>
                                        </Tooltip>
                                        {payout.status === 'pending' && (
                                            <Tooltip title="Process Payment">
                                                <IconButton color="success" size="small">
                                                    <CheckCircle />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default PayoutManagement;
