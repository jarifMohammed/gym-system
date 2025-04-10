const mongoose = require("mongoose");
require("dotenv").config();  // Load environment variables from .env file

const connectDB = async () => {
  try {
    // Connection URI
    const dbURI = process.env.DB_URL;

    // Connect to MongoDB using Mongoose
    await mongoose.connect(dbURI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,  
      serverSelectionTimeoutMS: 30000, 
    });

    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);  // Exit the process if MongoDB connection fails
  }
};

module.exports = connectDB;
