
const express = require('express');
const cors = require('cors');

const app = express();

// Database connection
require('./db');

app.use(cors());
app.use(express.json());

// Import routes
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');

// Connect routes
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Library Management System API is running!');
});

// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
