import { Request } from "express"; 
import * as fs from 'fs'
import { TypedResponse } from "../interfaces/express.type";
import { Message } from "../models/message.type";

const multer = require('multer');
const path = require('path');

type Callback = (error: any, destination: string) => void;

const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cd: Callback) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cd(null, uploadDir)

    },
    filename: function (req: Request, file: Express.Multer.File, cb: Callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
})

const imageFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, 'File type is allowed');
    } else {
        cb(new Error('Invalid file type'), 'File type is not allowed');
    }
}


const upload = multer({ storage: storage, fileFilter: imageFilter });

export const uploadFile = (req: Request, res: TypedResponse<Message>) => {
    const file = req.file

    try {
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log(file)
        return res.status(200).json({ message: 'File uploaded successfully', file })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error uploading file' });
    }
}

export default upload