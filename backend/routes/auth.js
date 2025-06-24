const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, phoneNumber, password, is_admin, organization } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            phoneNumber,
            password: hashedPassword,
            is_admin: is_admin || false,
            organization: organization 
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful. Waiting for admin approval.',
            data: {
                userId: user._id,
                status: 'pending_approval'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        // Find user
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if approved
        if (!user.status) {
            return res.status(403).json({
                success: false,
                message: 'Account not approved'
            });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET ,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    phoneNumber: user.phoneNumber,
                    is_admin: user.is_admin,
                    organization: user.organization
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get pending users (Admin only)
router.get('/pending-users', adminAuth, async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: false }).select('-password');

        res.json({
            success: true,
            data: pendingUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Approve user (Admin only)
router.patch('/approve-user/:userId', adminAuth, async (req, res) => {
    try {
        console.log('Approving user with ID:', req.params.userId);
        
        const user = await User.findById(req.params.userId);
        console.log('User found:', user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('User status before approval:', user.status);
        
        user.status = true;
        const savedUser = await user.save();
        
        console.log('User status after approval:', savedUser.status);
        console.log('User saved successfully:', savedUser._id);

        res.json({
            success: true,
            message: 'User approved successfully',
            data: {
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                is_admin: user.is_admin,
                organization: user.organization,
                status: user.status // Add this to see the status in response
            }
        });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Reject user (Admin only)
router.delete('/reject-user/:userId', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await User.findByIdAndDelete(req.params.userId);

        res.json({
            success: true,
            message: 'Operation completed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;