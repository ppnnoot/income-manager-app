import { TypedRequestBody, TypedRequestQuery, TypedResponse } from "../interfaces/express.type";
import { connectDB } from "../db";
import { ObjectId } from 'mongodb';
import { Message } from "../models/message.type";
import { Account } from "../models/account.type";


export const createAccount = async (req: TypedRequestBody<Account>, res: TypedResponse<Message>) => {


};