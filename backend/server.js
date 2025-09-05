// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Import the connection function

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));