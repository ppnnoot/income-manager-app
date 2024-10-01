import { CustomRequest, TypedResponse } from "../interfaces/express.type";
import { connectDB } from "../db";
import { ObjectId } from 'mongodb';
import { Message } from "../models/message.type";
import { getAccountById } from "./account.controller";
import { getCategory, getCategoryById } from "./category.controller";

export const createTransaction = async (req: CustomRequest, res: TypedResponse<Message>) => {
    const { transactId, accountId, categoryId, amount, slip, note } = req.body;
    const { userId } = req;

    if (!transactId || !accountId || !categoryId || !amount) {
        return res.status(400).json({ message: 'Parameter is required' });
    };

    const account = await getAccountById(accountId);
    const category = await getCategoryById(categoryId);

    if (!account || !category) {
        return res.status(404).json({ message: 'Account or category not found' });
    }

    try {
        const database = await connectDB();

        const isExisting = await database.collection('transactions').findOne({ transactId });
        if (isExisting) {
            return res.status(400).json({ message: 'Transaction id already exists' });
        }

        const transactData = {
            transactId : Number(transactId),
            account : { accountId : account.accountId, accountName : account.accountName },
            category : { categoryId : category.categoryId, categoryName : category.categoryName },
            amount : Number(amount),
            slip : slip,
            note : note,
            createdAt: new Date(),
            userId: userId
        };

        await database.collection('transactions').insertOne(transactData);
        return res.status(201).json({ message: 'Transaction created successfully', transaction: transactData });
    } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}