import { Db } from 'mongodb';

export const paginateTransactions = async (database: Db, userId: string, query: any) => {
    // default values
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 5;

    // calculate skip
    const skip = (page - 1) * limit;

    // find transactions with pagination and limit
    const transactions = await database.collection('transactions')
        .find({ userId })
        .skip(skip)
        .limit(limit)
        .toArray();

    // calculate total pages
    const totalTransactions = await database.collection('transactions').countDocuments({ userId });
    const totalPages = Math.ceil(totalTransactions / limit);


    return {
        transactions,
        currentPage: page,
        totalPages,
        totalTransactions
    };
};