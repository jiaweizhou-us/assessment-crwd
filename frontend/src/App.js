import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Chip,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    AttachMoney,
    Security,
    Logout,
    Person,
    AdminPanelSettings
} from '@mui/icons-material';
import AuthForm from './components/AuthForm';
import PayoutList from './components/PayoutList';
import AdminDashboard from './components/AdminDashboard';
import PayoutGuard from './components/PayoutGuard';

// Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    username: payload.username,
                    role: payload.role || 'user',
                    userId: payload.userId
                });
            } catch (error) {
                console.error('Error parsing token:', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
                username: payload.username,
                role: payload.role || 'user',
                userId: payload.userId
            });
        } catch (error) {
            console.error('Error parsing token:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Navigation Component
const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout } = useAuth();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { 
            text: 'Payout Guard', 
            icon: <Security />, 
            path: '/payout-guard',
            roles: ['user', 'admin']
        },
        { 
            text: 'Payout Management', 
            icon: <AttachMoney />, 
            path: '/payout-list',
            roles: ['admin']
        },
        { 
            text: 'Admin Dashboard', 
            icon: <Dashboard />, 
            path: '/admin-dashboard',
            roles: ['admin']
        }
    ];

    const filteredMenuItems = menuItems.filter(item => 
        !item.roles || item.roles.includes(user?.role)
    );

    const drawer = (
        <Box sx={{ width: 250 }}>
            <Box sx={{ p: 2, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                    🔐 CRWD Platform
                </Typography>
                {user && (
                    <Chip 
                        label={user.role.toUpperCase()} 
                        size="small" 
                        sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                )}
            </Box>
            <Divider />
            <List>
                {filteredMenuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.text}
                        onClick={() => {
                            navigate(item.path);
                            setMobileOpen(false);
                        }}
                        selected={location.pathname === item.path}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                borderRight: '3px solid #2196F3'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? '#2196F3' : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.text} 
                            sx={{ 
                                '& .MuiListItemText-primary': { 
                                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                                    color: location.pathname === item.path ? '#2196F3' : 'inherit'
                                }
                            }}
                        />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    );

    if (!user) return null;

    return (
        <>
            <AppBar 
                position="fixed" 
                sx={{ 
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    zIndex: theme.zIndex.drawer + 1
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        🔐 CRWD Platform
                    </Typography>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                            {filteredMenuItems.map((item) => (
                                <Button
                                    key={item.text}
                                    color="inherit"
                                    onClick={() => navigate(item.path)}
                                    startIcon={item.icon}
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                            icon={user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                            label={user.username}
                            variant="outlined"
                            sx={{ 
                                color: 'white', 
                                borderColor: 'white',
                                mr: 1,
                                '& .MuiChip-icon': { color: 'white' }
                            }}
                        />
                        <IconButton
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            color="inherit"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                                {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem onClick={() => setAnchorEl(null)}>
                                <Person sx={{ mr: 1 }} />
                                Profile
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <Logout sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                >
                    {drawer}
                </Drawer>
            )}

            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: 250,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 250,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <Toolbar />
                    {drawer}
                </Drawer>
            )}
        </>
    );
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/payout-guard" replace />;
    }

    return children;
};

// Main App Component
function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Typography variant="h4" sx={{ color: 'white' }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Navigation />
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1,
                    minHeight: '100vh',
                    marginTop: user ? '64px' : 0
                }}
            >
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            user ? (
                                user.role === 'admin' 
                                    ? <Navigate to="/admin-dashboard" replace /> 
                                    : <Navigate to="/payout-guard" replace />
                            ) : <AuthForm />
                        } 
                    />
                    <Route 
                        path="/payout-guard" 
                        element={
                            <ProtectedRoute>
                                <PayoutGuard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/payout-list" 
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <PayoutList />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin-dashboard" 
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default App;
