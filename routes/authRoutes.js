const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register Routes
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Login Routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Logout Route
router.get('/logout', authController.logout);

module.exports = router;
