import { CustomRequest, TypedRequestBody, TypedRequestQuery, TypedResponse } from "../interfaces/express.type";
import { connectDB } from "../db";
import { ObjectId } from 'mongodb';
import { Message } from "../models/message.type";
import { Account } from "../models/account.type";
import { Request, Response } from 'express';

export const getAccount = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {
    const { id } = req.params; // ดึง accountId จาก params
    const { userId } = req;

    if (!id || !userId) {
        return res.status(400).json({ message: 'Account ID and User ID are required' });
    }

    try {
        const database = await connectDB();
        const account = await database.collection('accounts').findOne({ accountId: Number(id), userId }); // เปลี่ยนเป็น Number(id) ถ้าจำเป็น

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        return res.status(200).json({ message: 'Account retrieved successfully', account });
    } catch (error) {
        console.error('Error retrieving account:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAccounts = async ( req: CustomRequest, res: TypedResponse<{ accounts: Account[] }> ): Promise<void> => {
    const { userId } = req

    if (!userId) {
        return res.status(400).json({ message: 'Authorization failed' });
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

export const createAccount = async ( req: CustomRequest, res: TypedResponse<{ message: string; account: Account }>): Promise<void> => {
    const { accountId, accountName} = req.body;
    const { userId } = req;

    if (!accountId || !accountName || !userId) {
        return res.status(400).json({ message: 'account id and name are required' });
    }

    const accountData = {accountId, accountName, userId };

    try {
        const database = await connectDB();

        const isExisting = await database.collection('accounts').findOne(accountData);
        if (isExisting) {
            return res.status(400).json({ message: 'Account name already exists' });
        }

        await database.collection('accounts').insertOne(accountData)
        res.status(201).json({ message: 'Account created successfully', account: accountData });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAccount = async ( req: CustomRequest, res: TypedResponse<{ message: string; accountId: Number }> ): Promise<void> => {

    const { accountId } = req.params;
    const { userId } = req;

    if (!accountId || !userId) {
        return res.status(400).json({ message: 'Account name is required' });
    }

    try {
        const database = await connectDB();
        const result = await database.collection('accounts').deleteOne({ accountId, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Account to be deleted not found' });
        }

        return res.status(200).json({ message: 'Account deleted successfully', accountId: accountId });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

