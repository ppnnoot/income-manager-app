import { CustomRequest, TypedRequestBody, TypedRequestQuery, TypedResponse } from "../interfaces/express.type";
import { connectDB } from "../db";
import { ObjectId } from 'mongodb';
import { Message } from "../models/message.type";
import { Account } from "../models/account.type";
import { Request, Response } from 'express';


export const getCategoryByUserId = async (userId: string, categoryId: number) => {
    const database = await connectDB();
    const categoryData = await database.collection('categories').findOne({ userId, categoryId });
    return categoryData;
};

export const createCategory = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {

    const categoryId : number = req.body.categoryId;
    const categoryName : string = req.body.categoryName;
    const userId = req.userId;

    if (!categoryId || !categoryName || !userId) {
        return res.status(400).json({ message: 'Category ID and name is required' });
    }

    const isExisting = await getCategoryByUserId(userId, categoryId);
    if (isExisting) {
        return res.status(400).json({ message: 'Category name already exists' });
    }

    try {
        const database = await connectDB();

        const categoryData = { categoryId, categoryName, userId };
        await database.collection('categories').insertOne(categoryData);

        return res.status(201).json({ message: 'Category created successfully' , category: categoryData });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

export const deleteCategory = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {
    const categoryId = req.body.categoryId;
    const userId = req.userId;

    if (!categoryId || !userId) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const database = await connectDB();
        const result = await database.collection('categories').deleteOne({ categoryId, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Category to be delete not found' });
        }

        return res.status(200).json({ message: 'Category deleted successfully', categoryId: categoryId });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getCategories = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {
    const userId = req.userId

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    
    try {
        const database = await connectDB();
        const categories = await database.collection('categories').find({ userId }).toArray();

        if (!categories.length) {
            return res.status(404).json({ message: 'No categories found for this user' });
        }

        return res.status(200).json({ categories });
    } catch (error) {
        console.error('Error retrieving categories:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}