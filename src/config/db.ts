import { logger } from "@/utils/logger";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_DB_URI = process.env.MONGO_DB_URI;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_DB_URI as string, {
      dbName: process.env.MONGO_DB_NAME,
    });
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    process.exit(1); // Exit process with failure
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error("MongoDB disconnection failed", error);
  }
};
