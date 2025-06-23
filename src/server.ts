import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { logger } from "./utils/logger";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { UserModel } from "@/models/user.model";
import userModule from "@/modules/user/user.module";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 3000;

const app: Application = express();

// Middleware
dotenv.config();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const userRouter = userModule(UserModel);
app.use("/api/v2/users", userRouter);

// Routes
app.get("/api/v2", (req, res) => {
  logger.info("Root endpoint hit");
  res.send("Welcome to the Smart Patrol API");
});

app.get("/health", (req, res) => {
  logger.info("Health check endpoint hit");
  // Here you can add more health checks, like database connection status
  // For now, just return a simple status
  logger.info("Health check passed");
  res.status(200).json({ status: "UP" });
});

// Global middleware
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
