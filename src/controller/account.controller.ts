import { CustomRequest, TypedRequestBody, TypedRequestQuery, TypedResponse } from "../interfaces/express.type";
import { connectDB } from "../db";
import { ObjectId } from 'mongodb';
import { Message } from "../models/message.type";
import { Account } from "../models/account.type";
import { Request, Response } from 'express';

const stroeAccount = async (account: Account): Promise<void> => {
    const database = await connectDB();
    await database.collection('accounts').insertOne(account);
};

export const getAccountsByUserId = async (
    req: CustomRequest,
    res: TypedResponse<{ accounts: Account[] }>,
): Promise<void> => {
    const { userId } = req;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const database = await connectDB();
        const accounts = await database.collection('accounts').find({ userId }).toArray();

        if (!accounts.length) {
            return res.status(404).json({ message: 'No accounts found for this user' });
        }

        return res.status(200).json({ accounts });
    } catch (error) {
        console.error('Error retrieving accounts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createAccount = async (
    req: CustomRequest,
    res: TypedResponse<{ message: string; account: Omit<Account, 'id'> }>,
): Promise<void> => {
    const { accountName } = req.body;
    const { userId } = req;

    if (!accountName || !userId) {
        return res.status(400).json({ message: 'Account name and user ID are required' });
    }

    const newAccount: Omit<Account, 'id'> = { accName: accountName, balance: 0, userId };

    try {
        await stroeAccount(newAccount);
        res.status(201).json({ message: 'Account created successfully', account: newAccount });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAccountById = async (
    req: CustomRequest,
    res: TypedResponse<{ message: string; AccountName: string }>,
): Promise<void> => {
    const { id: accountName } = req.params;
    const { userId } = req;

    if (!accountName || !userId) {
        return res.status(400).json({ message: 'Account name is required' });
    }

    try {
        const database = await connectDB();
        const result = await database.collection('accounts').deleteOne({ accName: accountName, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Account to be deleted not found' });
        }

        return res.status(200).json({ message: 'Account deleted successfully', AccountName: accountName });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAccountByQuery = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {
    const accountName = req.query.accountName;
    const userId = req.userId;

    if (!accountName || !userId) {
        return res.status(400).json({ message: 'Account name is required' });
    }

    try {
        const database = await connectDB();
        const result = await database.collection('accounts').deleteOne({ accName: accountName, userId: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Account to be delete not found' });
        }

        return res.status(200).json({ message: 'Account deleted successfully', accountName: accountName });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

