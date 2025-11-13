const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5500;

// Import routes
const inventoryRoutes = require('./routes/inventoryRoutes');

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MVC Routes
app.use('/inventory', inventoryRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index', {
        title: 'CSE Motors Uganda - Quality Vehicles',
        page: 'home',
        lastUpdated: new Date().toLocaleDateString('en-UG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Server Error - CSE Motors',
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found - CSE Motors',
        message: 'The page you are looking for does not exist.'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`CSE Motors Uganda server running on http://localhost:${PORT}`);
});