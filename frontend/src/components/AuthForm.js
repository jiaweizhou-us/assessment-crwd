import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    CardContent,
    IconButton,
    InputAdornment,
    Alert,
    Fade,
    CircularProgress,
    Divider,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { API_ENDPOINTS } from '../config/api';

const AuthForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [isSignup, setIsSignup] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    // Password strength validation
    const getPasswordStrength = (password) => {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        score = Object.values(checks).filter(Boolean).length;
        return { score, checks };
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (isSignup) {
            const { score } = getPasswordStrength(formData.password);
            if (score < 3) {
                newErrors.password = 'Password must be stronger (use uppercase, lowercase, numbers, and special characters)';
            }
        }

        // Confirm password validation (signup only)
        if (isSignup) {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear errors as user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            const url = isSignup ? API_ENDPOINTS.SIGNUP : API_ENDPOINTS.LOGIN;

            const response = await axios.post(url, {
                username: formData.username,
                password: formData.password
            });

            // Use the AuthContext login method
            login(response.data.token);
            
            setSuccessMessage(isSignup ? 'Account created successfully!' : 'Welcome back!');
            
            // Delay navigation for better UX - AuthContext will handle the redirect
            setTimeout(() => {
                // The AuthProvider will automatically redirect based on user role
                navigate('/');
            }, 1500);
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setIsSignup(!isSignup);
        setFormData({ username: '', password: '', confirmPassword: '' });
        setErrors({});
        setSuccessMessage('');
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}
        >
            <Container maxWidth="sm">
                <Fade in timeout={800}>
                    <Paper
                        elevation={24}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)'
                        }}
                    >
                        <Box
                            sx={{
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                padding: 4,
                                textAlign: 'center',
                                color: 'white'
                            }}
                        >
                            <Typography variant="h1" sx={{ fontSize: 48, mb: 2 }}>
                                🔐
                            </Typography>
                            <Typography variant="h3" component="h1" fontWeight="bold">
                                CRWD Security
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                                {isSignup ? 'Create Your Account' : 'Welcome Back'}
                            </Typography>
                        </Box>

                        <CardContent sx={{ padding: 4 }}>
                            {successMessage && (
                                <Fade in>
                                    <Alert 
                                        severity="success" 
                                        sx={{ mb: 3, borderRadius: 2 }}
                                    >
                                        {successMessage}
                                    </Alert>
                                </Fade>
                            )}

                            {errors.submit && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                    {errors.submit}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <TextField
                                    label="Username"
                                    fullWidth
                                    value={formData.username}
                                    onChange={handleInputChange('username')}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    margin="normal"
                                    variant="outlined"
                                    disabled={loading}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />

                                <TextField
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    margin="normal"
                                    variant="outlined"
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    disabled={loading}
                                                >
                                                    {showPassword ? '🙈' : '👁️'}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />

                                {isSignup && formData.password && (
                                    <Box sx={{ mt: 1, mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Password Strength:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <Box
                                                    key={level}
                                                    sx={{
                                                        height: 4,
                                                        flex: 1,
                                                        borderRadius: 1,
                                                        backgroundColor: level <= passwordStrength.score
                                                            ? passwordStrength.score < 3 ? '#f44336'
                                                            : passwordStrength.score < 4 ? '#ff9800'
                                                            : '#4caf50'
                                                            : '#e0e0e0'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                        <Typography variant="caption" color="textSecondary">
                                            {passwordStrength.score < 3 ? 'Weak' : 
                                             passwordStrength.score < 4 ? 'Medium' : 'Strong'}
                                        </Typography>
                                    </Box>
                                )}

                                {isSignup && (
                                    <TextField
                                        label="Confirm Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        fullWidth
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange('confirmPassword')}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        margin="normal"
                                        variant="outlined"
                                        disabled={loading}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                        disabled={loading}
                                                    >
                                                        {showConfirmPassword ? '🙈' : '👁️'}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        height: 56,
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 30%, #1BA5D2 90%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 10px 2px rgba(33, 203, 243, .3)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        isSignup ? '🚀 Create Account' : '🔑 Sign In'
                                    )}
                                </Button>

                                <Divider sx={{ my: 2 }} />

                                <Button
                                    fullWidth
                                    variant="text"
                                    onClick={toggleAuthMode}
                                    disabled={loading}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        padding: 1.5,
                                        '&:hover': {
                                            background: 'rgba(33, 150, 243, 0.08)'
                                        }
                                    }}
                                >
                                    {isSignup 
                                        ? '👤 Already have an account? Sign In' 
                                        : "✨ Don't have an account? Create One"
                                    }
                                </Button>
                            </form>
                        </CardContent>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default AuthForm;