import express, { Express } from "express";
import cors from "cors";

const app: Express = express();

app.use(cors());
app.use(express.json());

// Export the app instance for use in index.ts
export default app;
