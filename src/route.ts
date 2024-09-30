import express from 'express';
import { getUserById, loginUser, registerUser } from './controller/user.controller';
import { authenticate } from './middleware';
import { CustomRequest } from './interfaces/express.type';
import { 
    createAccount, 
    deleteAccountById, 
    deleteAccountByQuery, 
    getAccountsByUserId 
} from './controller/account.controller';


const router = express.Router();

router.get('/protected', authenticate, async (req: CustomRequest, res) => {
    const userData = await getUserById(req.userId);
    console.log(userData);
    res.status(200).json({ message: `Welcome userId ${req.userId}` });
});

router.post('/login', loginUser);
router.post('/register', registerUser);

router.get('/accounts', authenticate, getAccountsByUserId);
router.post('/account', authenticate, createAccount);
router.delete('/accounts/:id', authenticate, deleteAccountById);
router.delete('/account', authenticate, deleteAccountByQuery);

export default router;
 