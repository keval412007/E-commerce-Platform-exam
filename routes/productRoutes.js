const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, checkUser } = require('../middlewares/authMiddleware');

// View all products (accessible with or without login)
router.get('/', checkUser, productController.getAllProducts);

// View user-specific products (protected route)
router.get('/my-products', verifyToken, productController.getMyProducts);

// Add product routes (protected)
router.get('/add', verifyToken, productController.getAddProductForm);
router.post('/add', verifyToken, productController.createProduct);

// Single product item view
router.get('/item/:id', checkUser, productController.getProductDetails);

// Edit product routes (protected)
router.get('/edit/:id', verifyToken, productController.getEditProductForm);
router.post('/edit/:id', verifyToken, productController.updateProduct);

// Delete product route (protected)
router.get('/delete/:id', verifyToken, productController.deleteProduct);

module.exports = router;
