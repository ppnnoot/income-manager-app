import express from 'express';
import { authenticate } from './middleware';
import { CustomRequest } from './interfaces/express.type';
import { getUserById, loginUser, registerUser } from './controller/user.controller';
import { createAccount, deleteAccount, getAccounts, getAccount } from './controller/account.controller';
import { createCategory, deleteCategory, getCategories, getCategory } from './controller/category.controller';
import { createTransaction } from './controller/transaction.controller';


const router = express.Router();

router.get('/protected', authenticate, async (req: CustomRequest, res) => {
    const userData = await getUserById(req.userId);
    console.log(userData);
    res.status(200).json({ message: `Welcome userId ${req.userId}` });
});

router.post('/login', loginUser);
router.post('/register', registerUser);


router.get('/accounts', authenticate, getAccounts);
router.post('/account', authenticate, createAccount);
router.get('/account/:id', authenticate, getAccount);
router.delete('/account/:id', authenticate, deleteAccount);


router.get('/categories', authenticate, getCategories);
router.post('/category', authenticate, createCategory);
router.get('/category/:id', authenticate, getCategory);
router.delete('/category/:id', authenticate, deleteCategory);


router.post('/transaction', authenticate, createTransaction);

export default router;
 