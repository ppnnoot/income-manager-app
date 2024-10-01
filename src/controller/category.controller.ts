import { CustomRequest, TypedRequestBody, TypedRequestQuery, TypedResponse } from "../interfaces/express.type";
import { connectDB } from "../db";
import { ObjectId } from 'mongodb';
import { Message } from "../models/message.type";
import { Account } from "../models/account.type";
import { Request, Response } from 'express';


export const getCategoryByUserId = async (userId: string, nameCategory: string) => {
    const database = await connectDB();
    const categoryData = await database.collection('categories').findOne({ userId, nameCategory });
    return categoryData;
};

export const createCategory = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {

    const nameCategory = req.body.nameCategory;
    const { userId } = req;

    if (!nameCategory || !userId) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    const isExisting = await getCategoryByUserId(userId, nameCategory);
    if (isExisting) {
        return res.status(400).json({ message: 'Category name already exists' });
    }

    try {
        const database = await connectDB();

        const categoryData = { nameCategory, userId };
        await database.collection('categories').insertOne(categoryData);

        return res.status(201).json({ message: 'Category created successfully' , category: categoryData });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

export const deleteCategoryByName = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {
    const nameCategory = req.body.nameCategory;
    const { userId } = req;

    if (!nameCategory || !userId) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const database = await connectDB();
        const result = await database.collection('categories').deleteOne({ nameCategory, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Category to be delete not found' });
        }

        return res.status(200).json({ message: 'Category deleted successfully', nameCategory: nameCategory });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getCategories = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {
    const { userId } = req;

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