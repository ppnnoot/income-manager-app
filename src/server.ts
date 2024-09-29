import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./controller/db";
import dotenv from "dotenv";
import route from "./route";

dotenv.config();
  
const app = express();import winston from 'express-winston';

const PORT = process.env.PORT || 3000

app.use(bodyParser.json());

app.use("/", route); 

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer();