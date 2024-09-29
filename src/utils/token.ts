// install npm i uuid @types/uuid

import { v4 as uuidv4 } from 'uuid';
import { connectDB } from '../controller/db';

export const generateToken = (): string => {
    return uuidv4();
}

export const storeToken = async (userId: object, token: string) => {
    const database = await connectDB();
    await database.collection('tokens').insertOne({ userId, token });
}

export const getUserByToken = async (token: string) => {
    const database = await connectDB();
    return await database.collection('tokens').findOne({ token });
}