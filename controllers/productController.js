const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const mongoose = require('mongoose');
const { mockProducts, mockCategories, mockUsers } = require('../config/mockStore');

// Get all products with optional category filtering and populate
exports.getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let products = [];
        let categories = [];

        if (mongoose.connection.readyState === 1) {
            let filter = {};
            if (category) {
                filter.category = category;
            }
            products = await Product.find(filter)
                .populate('category')
                .populate('user', 'username');
            categories = await Category.find();
        } else {
            categories = mockCategories;
            products = mockProducts;
            if (category) {
                products = products.filter(p => (p.category && (p.category._id.toString() === category || p.category.toString() === category)));
            }
        }

        res.render('productList', {
            products,
            categories,
            selectedCategory: category || ''
        });
    } catch (err) {
        console.error(err);
        res.render('productList', {
            products: mockProducts,
            categories: mockCategories,
            selectedCategory: ''
        });
    }
};

// Get user-specific products (Multiuser support)
exports.getMyProducts = async (req, res) => {
    try {
        let userProducts = [];
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(req.user.id).populate({
                path: 'products',
                populate: { path: 'category' }
            });
            userProducts = user ? user.products : [];
        } else {
            userProducts = mockProducts.filter(p => {
                const pUserId = (p.user && p.user._id) ? p.user._id.toString() : (p.user ? p.user.toString() : '');
                return pUserId === req.user.id || (p.user && p.user.username === req.user.username);
            });
        }

        res.render('myProducts', {
            products: userProducts
        });
    } catch (err) {
        console.error(err);
        res.render('myProducts', { products: [] });
    }
};

// Show single product detail (productItem.ejs)
exports.getProductDetails = async (req, res) => {
    try {
        let product = null;
        if (mongoose.connection.readyState === 1) {
            product = await Product.findById(req.params.id)
                .populate('category')
                .populate('user', 'username');
        } else {
            product = mockProducts.find(p => p._id.toString() === req.params.id);
        }

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('productItem', { product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching product details');
    }
};

// Render form to add a new product
exports.getAddProductForm = async (req, res) => {
    try {
        let categories = [];
        if (mongoose.connection.readyState === 1) {
            categories = await Category.find();
        } else {
            categories = mockCategories;
        }
        res.render('productForm', {
            categories,
            product: null,
            action: '/products/add'
        });
    } catch (err) {
        console.error(err);
        res.render('productForm', {
            categories: mockCategories,
            product: null,
            action: '/products/add'
        });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    const { name, price, description, category } = req.body;
    try {
        if (mongoose.connection.readyState === 1) {
            const newProduct = new Product({
                name,
                price,
                description,
                category,
                user: req.user.id
            });

            const savedProduct = await newProduct.save();

            await User.findByIdAndUpdate(req.user.id, {
                $push: { products: savedProduct._id }
            });
        } else {
            const foundCategory = mockCategories.find(c => c._id.toString() === category) || { _id: category, name: 'General' };
            const newProd = {
                _id: 'prod_' + Date.now(),
                name,
                price: parseFloat(price),
                description,
                category: foundCategory,
                user: { _id: req.user.id, username: req.user.username },
                createdAt: new Date()
            };
            mockProducts.push(newProd);

            const userInMock = mockUsers.find(u => u.username === req.user.username || u._id === req.user.id);
            if (userInMock) {
                userInMock.products = userInMock.products || [];
                userInMock.products.push(newProd._id);
            }
        }

        res.redirect('/products/my-products');
    } catch (err) {
        console.error(err);
        res.redirect('/products/my-products');
    }
};

// Render form to edit product
exports.getEditProductForm = async (req, res) => {
    try {
        let product = null;
        let categories = [];

        if (mongoose.connection.readyState === 1) {
            product = await Product.findById(req.params.id);
            categories = await Category.find();
        } else {
            product = mockProducts.find(p => p._id.toString() === req.params.id);
            categories = mockCategories;
        }

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('productForm', {
            categories,
            product,
            action: `/products/edit/${product._id}`
        });
    } catch (err) {
        console.error(err);
        res.redirect('/products');
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    const { name, price, description, category } = req.body;
    try {
        if (mongoose.connection.readyState === 1) {
            const product = await Product.findById(req.params.id);
            if (product) {
                product.name = name;
                product.price = price;
                product.description = description;
                product.category = category;
                await product.save();
            }
        } else {
            const product = mockProducts.find(p => p._id.toString() === req.params.id);
            if (product) {
                product.name = name;
                product.price = parseFloat(price);
                product.description = description;
                const foundCategory = mockCategories.find(c => c._id.toString() === category);
                if (foundCategory) product.category = foundCategory;
            }
        }
        res.redirect('/products/my-products');
    } catch (err) {
        console.error(err);
        res.redirect('/products/my-products');
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const product = await Product.findById(req.params.id);
            if (product) {
                await Product.findByIdAndDelete(req.params.id);
                await User.findByIdAndUpdate(product.user, {
                    $pull: { products: product._id }
                });
            }
        } else {
            const index = mockProducts.findIndex(p => p._id.toString() === req.params.id);
            if (index !== -1) {
                mockProducts.splice(index, 1);
            }
        }
        res.redirect('/products/my-products');
    } catch (err) {
        console.error(err);
        res.redirect('/products/my-products');
    }
};
