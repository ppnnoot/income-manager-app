import { NextFunction, Response } from "express"
import { CustomRequest, TypedResponse } from "./interfaces/express.type";
import { Message } from "./models/user.type";


export const authenticate = async ( req: CustomRequest, res: TypedResponse<Message>, next: NextFunction): Promise<void> => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }
    
    const userId = token.split('-')[0];
    if (!userId) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    req.userId = userId; // Add userId to request object
    next();
};
