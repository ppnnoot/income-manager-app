import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";


dotenv.config();

let db: Db | null = null;

if (!process.env.MONGODB_URI) {
    console.error("Please add your MONGODB_URI to .env.local");
}

export const connectDB = async (): Promise<Db> => {
    try {
        if (!db) {
            const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
            await client.connect();
            db = client.db(process.env.DB_NAME || "your_database");
        }
        return db;
    } catch (error) {
        throw new Error("Failed to connect to Database");
    }
};