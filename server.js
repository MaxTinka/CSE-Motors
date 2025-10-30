// server.js
const express = require('express');
const path = require('path');

const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server on port 5500
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
