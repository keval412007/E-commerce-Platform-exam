const Category = require('../models/Category');
const mongoose = require('mongoose');
const { mockCategories } = require('../config/mockStore');

// Get all categories
exports.getCategoryList = async (req, res) => {
    try {
        let categories = [];
        if (mongoose.connection.readyState === 1) {
            categories = await Category.find();
        } else {
            categories = mockCategories;
        }
        res.render('categoryList', { categories });
    } catch (err) {
        console.error(err);
        res.render('categoryList', { categories: mockCategories });
    }
};

// Add new category
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        if (mongoose.connection.readyState === 1) {
            const newCategory = new Category({ name, description });
            await newCategory.save();
        } else {
            mockCategories.push({
                _id: 'cat_' + Date.now(),
                name,
                description,
                createdAt: new Date()
            });
        }
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.redirect('/categories');
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        if (mongoose.connection.readyState === 1) {
            await Category.findByIdAndUpdate(id, { name, description });
        } else {
            const cat = mockCategories.find(c => c._id.toString() === id);
            if (cat) {
                cat.name = name;
                cat.description = description;
            }
        }
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.redirect('/categories');
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        if (mongoose.connection.readyState === 1) {
            await Category.findByIdAndDelete(id);
        } else {
            const index = mockCategories.findIndex(c => c._id.toString() === id);
            if (index !== -1) {
                mockCategories.splice(index, 1);
            }
        }
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.redirect('/categories');
    }
};
