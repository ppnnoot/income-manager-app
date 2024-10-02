import { CustomRequest, TypedResponse } from "../interfaces/express.type";
import { connectDB } from "../db";
import { Message } from "../models/message.type";
import { getAccountById } from "./account.controller";
import { getCategory, getCategoryById } from "./category.controller";
import { censorProfanity } from "../utils/profanity";
import { paginateTransactions } from "../utils/pagination";
import { ObjectId } from "mongodb";


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

export const getTransactionSummary = async (
    req: CustomRequest, 
    res: TypedResponse<{ message: string; summary?: any }>
) => {
    const { userId } = req;
    const { month, year, categoryId, accountId, group } = req.query;

    try {
        const database = await connectDB();
        const transactData = await database.collection('transactions').find({ userId }).toArray();

        // Filter transactions based on provided filters
        const filteredData = transactData.filter(transaction => {
            let isValid = true;

            if (categoryId) {
                isValid = isValid && transaction.categoryId === categoryId;
            }
            if (accountId) {
                isValid = isValid && transaction.accountId === accountId;
            }
            // Filter by month and year if provided
            const transactionDate = new Date(transaction.createdAt);
            if (month) {
                isValid = isValid && transactionDate.getMonth() + 1 === parseInt(month as string);
            }
            if (year) {
                isValid = isValid && transactionDate.getFullYear() === parseInt(year as string);
            }

            return isValid;
        });

        // Group by the specified grouping
        const groupedSummary = filteredData.reduce((acc, transaction) => {
            let key;

            if (group === 'day') {
                key = `${transaction.createdAt.getDate()}-${transaction.createdAt.getMonth() + 1}-${transaction.createdAt.getFullYear()}`;
            } else if (group === 'month') {
                key = `${transaction.createdAt.getMonth() + 1}-${transaction.createdAt.getFullYear()}`;
            } else if (group === 'year') {
                key = `${transaction.createdAt.getFullYear()}`;
            } else {

                key = `${transaction.createdAt.getDate()}-${transaction.createdAt.getMonth() + 1}-${transaction.createdAt.getFullYear()}`;
            }

            if (!acc[key]) {
                acc[key] = {
                    totalAmount: 0,
                    transactionCount: 0,
                };
            }

            acc[key].totalAmount += transaction.amount;
            acc[key].transactionCount += 1;

            return acc;
        }, {} as { [key: string]: { totalAmount: number; transactionCount: number } });

        // Format the grouped summary for the response
        const formattedSummary = Object.entries(groupedSummary).map(([date, summary]) => ({
            date,
            totalAmount: summary.totalAmount,
            transactionCount: summary.transactionCount,
        }));

        return res.status(200).json({
            message: 'Transaction summary retrieved successfully',
            groupBy : group,
            summary: formattedSummary,
        });

    } catch (error) {
        console.error('Error retrieving transaction summary:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

