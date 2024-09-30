import { TypedRequestBody, TypedRequestQuery, TypedResponse } from "../interfaces/express.type";
import { User } from "../models/user.type";
import { hashPassword, checkPassword } from "../utils/bcrypt"
import { generateAccessToken } from "../utils/token";
import { connectDB } from "../db"
import { ObjectId } from 'mongodb';
import { Message } from "../models/message.type";

export const createUser = async (userData: User) => {
    const database = await connectDB()
    const result = await database.collection('users').insertOne(userData)
    return { id: result.insertedId, ...userData }
}

export const getUserByUsername = async (username: string) => {
    const database = await connectDB();
    const user = await database.collection('users').findOne({ username });
    return user;
};

// get user by id
export const getUserById = async (userId: string | undefined)=> {
    const database = await connectDB();
    const user = await database.collection('users').findOne({ _id: new ObjectId(userId) });
    console.log(user);
    return user ? { id: user._id.toString(), username: user.username } : null;
};

export const registerUser = async (req: TypedRequestBody<User>, res: TypedResponse<Message>) => {
    const { username, password }: User = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    await createUser({ username, password: hashedPassword });

    console.log('Registered successfully' + username);
    return res.status(201).json({ message: 'Registered successfully' });
};


export const loginUser = async (req: TypedRequestBody<User>, res: TypedResponse<Message>) => {
    const { username, password }: User = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await getUserByUsername(username);
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = await generateAccessToken(user._id.toString());
    console.log(accessToken)


    // Login successful)
    console.log('Login successful');
    return res.status(200).json({ 
        message: 'Login successful',
        user: { 
            id: user._id, 
            username: user.username, 
            token: `${user._id}-${accessToken.token}`,
        }
    });
};

