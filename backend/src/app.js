const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes'); // NEW: Import group routes
const mealRoutes = require('./routes/mealRoutes'); // Import the new routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(helmet()); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/groups', groupRoutes);
app.use('/meals', mealRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;