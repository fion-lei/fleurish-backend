const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/gardens', require('./routes/gardenRoutes'));
app.use('/api/plots', require('./routes/plotRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/plant-types', require('./routes/plantTypeRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/growth', require('./routes/growthRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
