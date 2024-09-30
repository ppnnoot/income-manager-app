import { v4 as uuidv4 } from 'uuid';
import { connectDB } from '../db';
import { Token } from '../models/user.type';

export const generateAccessToken = (userId: string): Token => {
    const tokenData : Token = {
        userId,
        token: uuidv4(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    }

    stroeAccessToken(tokenData);
    return tokenData;
};

export const stroeAccessToken = async (accessToken: Token) => {
    const db = await connectDB();
    await db.collection('tokens').insertOne(accessToken);
};