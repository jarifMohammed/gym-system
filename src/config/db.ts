import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    // Connection URI
    const dbURI: string = process.env.DB_URL || "";

    // Connect to MongoDB using Mongoose
    await mongoose.connect(dbURI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
