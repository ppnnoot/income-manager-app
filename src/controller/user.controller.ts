import { TypedRequestBody, TypedRequestQuery, TypedResponse } from "../interfaces/express.type";
import { Message, User } from "../models/user.type";
import { hashPassword, checkPassword } from "../utils/bcrypt"
import { generateAccessToken } from "../utils/token";
import { connectDB } from "../db"




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
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    await createUser({ email, password: hashedPassword });

    console.log('Registered successfully' + email);
    return res.status(201).json({ message: 'Registered successfully' });
};


export const loginUser = async (req: TypedRequestBody<User>, res: TypedResponse<Message>) => {
    const { email, password }: User = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id.toString());

    // Login successful)
    console.log('Login successful' + email);
    return res.status(200).json({ 
        message: 'Login successful',
        user: { 
            id: user._id, 
            email: user.email, 
            token: accessToken,
        }
    });
};

