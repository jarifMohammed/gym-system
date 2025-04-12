import express, { Express } from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gym Management System API is running",
    documentation: "Please visit /api/v1/health for server status",
    endpoints: {
      auth: "/api/v1/auth",
      admin: "/api/v1/admin",
      trainer: "/api/v1/trainer",
      trainee: "/api/v1/trainee",
    },
  });
});

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running properly",
    timestamp: new Date().toISOString(),
    status: "healthy",
  });
});

// Import routes
import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import trainerRoutes from "./modules/trainer/trainer.route";
import traineeRoutes from "./modules/trainee/trainee.routes";

// Use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/trainer", trainerRoutes);
app.use("/api/v1/trainee", traineeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
