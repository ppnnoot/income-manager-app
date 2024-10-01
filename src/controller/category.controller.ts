import { CustomRequest, TypedRequestBody, TypedRequestQuery, TypedResponse } from "../interfaces/express.type";
import { connectDB } from "../db";
import { ObjectId } from 'mongodb';
import { Message } from "../models/message.type";
import { Account } from "../models/account.type";
import { Request, Response } from 'express';
import { Category } from "../models/category.type";


export const getCategory = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {
    const { id : categoryId } = req.params;
    const { userId } = req;

    if (!categoryId || !userId) {
        return res.status(400).json({ message: 'Parameter is required' });
    }

    try {
        const database = await connectDB();
        const category = await database.collection('categories').findOne({ categoryId: Number(categoryId), userId });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category retrieved successfully', category });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

}

export const getCategories = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {
    const userId = req.userId

    if (!userId) {
        return res.status(400).json({ message: 'Auhorization failed' });
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

export const createCategory = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {

    const { categoryId, categoryName } = req.body;
    const { userId } = req;

    if (!categoryId || !categoryName || !userId) {
        return res.status(400).json({ message: 'Category id and name are required' });
    }

    const categoryData : Category = { categoryId, categoryName, userId };

    try {
        const database = await connectDB();
        
        const isExisting = await database.collection('categories').findOne(categoryData);
        if (isExisting) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
    
        await database.collection('categories').insertOne(categoryData);
        return res.status(201).json({ message: 'Category created successfully' , category: categoryData });

    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export const deleteCategory = async ( req: CustomRequest, res: TypedResponse<Message> ): Promise<void> => {
    const { id : categoryId } = req.params;
    const userId = req.userId;

    if (!categoryId || !userId) {

        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const database = await connectDB();
        const result = await database.collection('categories').deleteOne({ categoryId: Number(categoryId), userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Category to be delete not found' });
        }
        return res.status(200).json({ message: 'Category deleted successfully'});

    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}