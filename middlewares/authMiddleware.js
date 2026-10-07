const jwt = require('jsonwebtoken');

const JWT_SECRET = 'my_jwt_secret_key_12345';

// Middleware to check if user is authenticated (protect private routes)
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        res.locals.user = decoded; // Available for all EJS templates
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

// Middleware to set user info in views for public routes without blocking
const checkUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            res.locals.user = decoded;
        } catch (err) {
            req.user = null;
            res.locals.user = null;
        }
    } else {
        req.user = null;
        res.locals.user = null;
    }
    next();
};

// Middleware to protect routes based on admin role
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send('Access Denied: Admin role required');
    }
};

module.exports = {
    JWT_SECRET,
    verifyToken,
    checkUser,
    isAdmin
};
