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
