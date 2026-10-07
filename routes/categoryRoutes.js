const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, checkUser, isAdmin } = require('../middlewares/authMiddleware');

// Get all categories (Public / with user context)
router.get('/', checkUser, categoryController.getCategoryList);

// Create category (Protected: admin or logged in user)
router.post('/add', verifyToken, categoryController.createCategory);

// Update category (Protected: admin)
router.post('/edit/:id', verifyToken, isAdmin, categoryController.updateCategory);

// Delete category (Protected: admin)
router.get('/delete/:id', verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
