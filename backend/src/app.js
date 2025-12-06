// backend/src/app.js
const express = require('express');
const helmet = require('helmet'); // Import Helmet
const cors = require('cors');
const connectDB = require('./config/db'); // **FIXED PATH**
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware (Should be at the end of all routes)
app.use(notFound);
app.use(errorHandler);

module.exports = app;