export type Transaction = {
    accountId: string;
    categoryId: string;
    amount: number;
    slip?: string;
    note?: string;
    createdAt: Date;
    userId: string;
};