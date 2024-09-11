const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { startListening } = require('./services/eventListener');
const transactionRoutes = require('./routers/transactionRoutes');
const cors = require("cors");
const cron = require("node-cron");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectDB();
// Routes
app.use('/api', transactionRoutes);

cron.schedule('*/30 * * * * *', () => {
  startListening();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
