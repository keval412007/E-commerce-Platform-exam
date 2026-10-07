// Fallback in-memory store so the website runs smoothly even if local MongoDB service is offline
const mockCategories = [
    { _id: '650000000000000000000001', name: 'Electronics', description: 'Gadgets and electronic items', createdAt: new Date() },
    { _id: '650000000000000000000002', name: 'Fashion & Clothing', description: 'Apparel and accessories', createdAt: new Date() },
    { _id: '650000000000000000000003', name: 'Books & Stationery', description: 'Books, notebooks and office supplies', createdAt: new Date() }
];

const mockProducts = [
    {
        _id: '660000000000000000000001',
        name: 'Wireless Bluetooth Headphones',
        price: 49.99,
        description: 'High quality sound with deep bass and noise cancellation.',
        category: { _id: '650000000000000000000001', name: 'Electronics' },
        user: { _id: 'admin123', username: 'admin' },
        createdAt: new Date()
    },
    {
        _id: '660000000000000000000002',
        name: 'Cotton Casual Shirt',
        price: 24.50,
        description: '100% pure cotton breathable casual shirt.',
        category: { _id: '650000000000000000000002', name: 'Fashion & Clothing' },
        user: { _id: 'user123', username: 'student' },
        createdAt: new Date()
    }
];

const mockUsers = [];

module.exports = {
    mockCategories,
    mockProducts,
    mockUsers
};
