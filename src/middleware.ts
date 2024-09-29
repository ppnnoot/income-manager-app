import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), 
});

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

