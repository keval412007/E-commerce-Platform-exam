const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_SECRET } = require('../middlewares/authMiddleware');
const { mockUsers } = require('../config/mockStore');

// Render Register Page
exports.getRegister = (req, res) => {
    res.render('register', { error: null });
};

// Handle User Registration
exports.postRegister = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (mongoose.connection.readyState === 1) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.render('register', { error: 'Username already exists!' });
            }

            const newUser = new User({
                username,
                password: hashedPassword,
                role: role || 'user'
            });
            await newUser.save();
        } else {
            // Fallback in-memory
            const existingUser = mockUsers.find(u => u.username === username);
            if (existingUser) {
                return res.render('register', { error: 'Username already exists!' });
            }
            mockUsers.push({
                _id: 'user_' + Date.now(),
                username,
                password: hashedPassword,
                role: role || 'user',
                products: []
            });
        }

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Registration failed. Please try again.' });
    }
};

// Render Login Page
exports.getLogin = (req, res) => {
    res.render('login', { error: null });
};

// Handle User Login
exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user;

        if (mongoose.connection.readyState === 1) {
            user = await User.findOne({ username });
        } else {
            user = mockUsers.find(u => u.username === username);
            // Default demo accounts if empty
            if (!user && username === 'admin' && password === 'admin123') {
                user = { _id: 'admin123', username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'admin', products: [] };
                mockUsers.push(user);
            }
        }

        if (!user) {
            return res.render('login', { error: 'Invalid Username or Password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid Username or Password' });
        }

        const payload = {
            id: user._id.toString(),
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true
        });

        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Login error occurred.' });
    }
};

// Handle Logout
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};
