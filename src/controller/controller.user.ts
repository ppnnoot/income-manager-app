import { TypedRequestBody, TypedRequestQuery, TypedResponse } from "../interfaces/express.type";
import { Message, User } from "../models/user.type";
import { hashPassword, checkPassword } from "../utils/auth"
import logger from "../utils/logger";
import { generateToken, storeToken } from "../utils/token";
import { connectDB } from "./db";



export const createUser = async (userData: User) => {
    const database = await connectDB()
    const result = await database.collection('users').insertOne(userData)
    return { id: result.insertedId, ...userData }
}

export const getUserByEmail = async (email: string) => {
    const database = await connectDB();
    const user = await database.collection('users').findOne({ email });
    return user;
};

export const registerUser = async (req: TypedRequestBody<User>, res: TypedResponse<Message>) => {
    const { email, password }: User = req.body;
    
    logger.info(`Registering user: ${email}`);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        logger.warn(`Email already exists: ${email}`);
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    await createUser({ email, password: hashedPassword });

    logger.info(`User registered successfully: ${email}`);
    return res.status(201).json({ message: 'Registered successfully' });
};


export const loginUser = async (req: TypedRequestBody<User>, res: TypedResponse<Message>) => {
    const { email, password }: User = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
        logger.warn(`This email does not exist, Please register first: ${email}`);
        return res.status(401).json({ message: 'This email does not exist, Please register first' });
    }

    const isPasswordValid = await checkPassword(password, user.password);
    
    if (!isPasswordValid) {
        logger.warn(`Invalid email or password: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken();
    await storeToken(user._id, token)

    // Login successful)
    logger.info(`Login successful: ${email}`);
    return res.status(200).json({ 
        message: 'Login successful',
        user: { 
            id: user._id, 
            email: user.email, 
            password: user.password,
            token: token }

    });
};