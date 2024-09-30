import express from 'express';
import { getUserById, loginUser, registerUser } from './controller/user.controller';
import { authenticate } from './middleware';
import { CustomRequest } from './interfaces/express.type';
import { createAccount } from './controller/account.controller';


const router = express.Router();

// Route register
router.post('/register', registerUser);

// Route login
router.post('/login', loginUser);


// Route test protected
router.get('/protected', authenticate, async (req: CustomRequest, res) => {
    const userData = await getUserById(req.userId);
    console.log(userData);
    res.status(200).json({ message: `Welcome userId ${req.userId}` });
});

router.post('/account', authenticate, createAccount);

export default router;
 