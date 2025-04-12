"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Connect to database
(0, db_1.default)();
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
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const trainer_route_1 = __importDefault(require("./modules/trainer/trainer.route"));
const trainee_routes_1 = __importDefault(require("./modules/trainee/trainee.routes"));
// Use routes
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/admin", admin_routes_1.default);
app.use("/api/v1/trainer", trainer_route_1.default);
app.use("/api/v1/trainee", trainee_routes_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
