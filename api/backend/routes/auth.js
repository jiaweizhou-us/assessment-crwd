// auth.js - Enhanced authentication routes
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Sign Up Route
router.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }
        
        if (username.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username must be at least 3 characters' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }

        const userExists = UserModel.getUserByUsername(username);
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username already exists' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = UserModel.createUser({ 
            username, 
            password: hashedPassword,
            email: email || `${username}@example.com`
        });

        const token = jwt.sign(
            { 
                username: newUser.username, 
                userId: newUser.id,
                role: newUser.role 
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({ 
            success: true, 
            message: 'User created successfully',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error creating user', 
            error: error.message 
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        const user = UserModel.getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }

        if (user.status === 'flagged') {
            return res.status(403).json({ 
                success: false, 
                message: 'Account has been flagged. Please contact support.' 
            });
        }

        const token = jwt.sign(
            { 
                username: user.username, 
                userId: user.id,
                role: user.role || 'user'
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({ 
            success: true, 
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error during login', 
            error: error.message 
        });
    }
});

// Verify Token Route
router.get('/verify', (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid token' 
                });
            }

            const user = UserModel.getUserByUsername(decoded.username);
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            const { password: _, ...userWithoutPassword } = user;

            res.json({ 
                success: true, 
                message: 'Token is valid',
                user: userWithoutPassword
            });
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error verifying token', 
            error: error.message 
        });
    }
});

module.exports = router;
