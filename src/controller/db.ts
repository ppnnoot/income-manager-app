import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";
import logger from "../utils/logger";

dotenv.config();

let db: Db | null = null;

export const connectDB = async (): Promise<Db> => {
    try {
        if (!db) {
            const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
            await client.connect();
            db = client.db(process.env.DB_NAME || "your_database");
            logger.info("Successfully connected to MongoDB")
        }
        return db;
    } catch (error) {
        logger.error("Error connecting to Database:", (error as Error).message);
        throw new Error("Failed to connect to Database");
    }
};