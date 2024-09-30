import { v4 as uuidv4 } from 'uuid';
import { connectDB } from '../db';
import { Token } from '../models/user.type';

const stroeAccessToken = async (accessToken: Token) => {
    const database = await connectDB();
    await database.collection('tokens').insertOne(accessToken);
};

const deleteExistingToken = async (userId: string): Promise<void> => {
    const database = await connectDB();
    await database.collection('tokens').deleteOne({ userId });
};

export const generateAccessToken = async (userId: string): Promise<Token> => {
    if (!userId) {
        throw new Error('User ID is required to generate an access token');
    }

        // delete existing token
    await deleteExistingToken(userId);

    const AccessToken: Token = {
        userId,
        token: uuidv4().replace(/-/g, ''),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    };

    // insert access token to database
    await stroeAccessToken(AccessToken);
    return AccessToken;
};