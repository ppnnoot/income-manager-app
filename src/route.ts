import express from 'express';
import { loginUser, registerUser } from './controller/user.controller';
import { authenticate } from './middleware';
import { CustomRequest } from './interfaces/express.type';

const router = express.Router();

// Route register
router.post('/register', registerUser);

// Route login
router.post('/login', loginUser);

router.get('/protected', authenticate, (req: CustomRequest, res) => {
    res.status(200).json({ message: `Welcome user ${req.userId}` });
});


export default router;
