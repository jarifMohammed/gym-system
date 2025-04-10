const express = require('express');
const connectDB = require('./src/config/db');
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Import routes
app.use('/api/v1/auth', require('./src/modules/auth/auth.routes'));

app.use('/api/v1/admin', require('./src/modules/schedule/admin.routes'));