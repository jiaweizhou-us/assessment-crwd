import React, { useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Tab,
    Tabs,
    AppBar,
    Toolbar
} from '@mui/material';
import {
    Dashboard,
    Assessment,
    People,
    RateReview,
    AccountBalance,
    Receipt
} from '@mui/icons-material';
import DashboardOverview from './admin/DashboardOverview';
import ReviewManagement from './admin/ReviewManagement';
import UserManagement from './admin/UserManagement';
import PayoutManagement from './admin/PayoutManagement';
import TransactionHistory from './admin/TransactionHistory';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const renderContent = () => {
        switch (selectedTab) {
            case 0:
                return <DashboardOverview />;
            case 1:
                return <ReviewManagement />;
            case 2:
                return <UserManagement />;
            case 3:
                return <PayoutManagement />;
            case 4:
                return <TransactionHistory />;
            default:
                return <DashboardOverview />;
        }
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
                    <Dashboard sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        🔐 CRWD Admin Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 3 }}>
                {/* Navigation Tabs */}
                <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.95)', mb: 3 }}>
                    <Tabs 
                        value={selectedTab} 
                        onChange={(e, newValue) => setSelectedTab(newValue)}
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab 
                            icon={<Assessment />} 
                            label="Dashboard Overview" 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<RateReview />} 
                            label="Review Management" 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<People />} 
                            label="User Management" 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<AccountBalance />} 
                            label="Payout Management" 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<Receipt />} 
                            label="Transaction History" 
                            iconPosition="start"
                        />
                    </Tabs>
                </Card>

                {/* Content Area */}
                <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.95)', minHeight: '500px' }}>
                    <CardContent sx={{ p: 0 }}>
                        {renderContent()}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default AdminDashboard;