import { CustomRequest, TypedResponse } from "../interfaces/express.type";
import { connectDB } from "../db";
import { Message } from "../models/message.type";
import { getAccountById } from "./account.controller";
import { getCategory, getCategoryById } from "./category.controller";
import { censorProfanity } from "../utils/profanity";
import { paginateTransactions } from "../utils/pagination";


export const createTransaction = async (req: CustomRequest, res: TypedResponse<Message>) => {
    const { transactId, accountId, categoryId, amount, slip, note } = req.body;
    const { userId } = req;

    if (!transactId || !accountId || !categoryId || !amount) {
        return res.status(400).json({ message: 'Parameter is required' });
    };

    try {
        const account = await getAccountById(accountId);
        const category = await getCategoryById(categoryId);
        const noteCleaned = await censorProfanity(note);

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const database = await connectDB();

        const isExisting = await database.collection('transactions').findOne({ transactId });
        if (isExisting) {
            return res.status(400).json({ message: 'Transaction id already exists' });
        }

        const transactData = {
            transactId : Number(transactId),
            account : { 
                accountId : account.accountId, 
                accountName : account.accountName 
            },
            category : { 
                categoryId : category.categoryId, 
                categoryName : category.categoryName 
            },
            amount : Number(amount),
            slip : slip || null,
            note : noteCleaned || null,
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

export const getTransactions = async (req: CustomRequest, res: TypedResponse<Message>): Promise<void> => {
    const  userId  = req.userId;

    if (!userId) {
        return res.status(400).json({ message: 'Auhorization failed' });
    }

    try {
        const database = await connectDB();
        const page = req.query.page;
        const limit = req.query.limit;
        
        // if query parameters exist, use pagination
        if (page !== null || limit !== null) {

            const paginatResult = await paginateTransactions(database, userId, req.query);

            return res.status(200).json({
                message: 'Transactions retrieved successfully',
                transactions: paginatResult.transactions,
                currentPage: paginatResult.currentPage,
                totalPages: paginatResult.totalPages,
                totalTransactions: paginatResult.totalTransactions
            });
        } else {

            const transactions = await database.collection('transactions').find({ userId }).toArray();
            return res.status(200).json({ message: 'All transactions retrieved successfully', transactions });
        }
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
 