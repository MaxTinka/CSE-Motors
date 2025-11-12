const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
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

// Start server
app.listen(PORT, () => {
    console.log(`CSE Motors Uganda server running on http://localhost:${PORT}`);
});