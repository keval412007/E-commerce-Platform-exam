# E-Commerce Platform - Node.js Practical Exam Project

A complete E-Commerce Platform built with Node.js, Express, EJS, and Mongoose using the MVC architecture.

## Features
- **MVC Pattern**: Organized with Models, Views, Controllers, and Routes.
- **Authentication**: JWT authentication with HTTP-only cookies.
- **Role-Based Access Control**: Separate permissions for `admin` and `user`.
- **Multi-user Support**: Users can add, view, edit, and delete their own products.
- **Category Support**: Filter products by category, manage categories.
- **Mongoose Populate**: Populating references for categories and users on products.
- **Responsive Views**: EJS views with Bootstrap 5.

## Project Structure
```text
├── config/
│   ├── db.js
│   └── mockStore.js
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   └── productController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── Category.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   └── productRoutes.js
├── views/
│   ├── partials/
│   │   └── navbar.ejs
│   ├── categoryList.ejs
│   ├── login.ejs
│   ├── myProducts.ejs
│   ├── productForm.ejs
│   ├── productItem.ejs
│   ├── productList.ejs
│   └── register.ejs
├── package.json
└── server.js
```

## How to Run
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   node server.js
   ```
4. Open browser at `http://localhost:3000`
