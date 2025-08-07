const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Use Render's dynamic port or fallback to 3000 locally
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));


// --- Data Loading ---
let products = [];
try {
    const productsData = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
    products = JSON.parse(productsData);
} catch (err) {
    console.error("Error reading or parsing products.json:", err);
}

// --- API Routes ---

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// GET /api/products/:id - Get a single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// POST /api/contact - Handle contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log('--- New Contact Form Submission ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('------------------------------------');
    res.status(200).json({ message: 'Thank you for your message! We will get back to you soon.' });
});

// POST /api/checkout - Handle checkout form submission
app.post('/api/checkout', (req, res) => {
    const { shippingDetails, cart } = req.body;
    console.log('--- New Checkout Submission ---');
    console.log('Shipping Details:', shippingDetails);
    console.log('Cart Items:', cart.map(item => `${item.name} (x${item.quantity})`).join(', '));
    console.log('-------------------------------');
    res.status(200).json({ message: 'Order placed successfully!', orderId: `ORD-${Date.now()}` });
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`PEAS backend server is running on port ${PORT}`);
});