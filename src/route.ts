import express from 'express';
import { getUserById, loginUser, registerUser } from './controller/user.controller';
import { authenticate } from './middleware';
import { CustomRequest } from './interfaces/express.type';
import { 
    createAccount, 
    deleteAccountById, 
    deleteAccountByQuery, 
    getAccounts
} from './controller/account.controller';

import { createCategory, deleteCategoryByName, getCategories } from './controller/category.controller';
// import { createTransaction } from './controller/transaction.controller';


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
router.delete('/accounts/:id', authenticate, deleteAccountById);
router.delete('/account', authenticate, deleteAccountByQuery);

router.get('/categories', authenticate, getCategories);
router.post('/category', authenticate, createCategory);
router.delete('/category/:name', authenticate, deleteCategoryByName);


// router.post('/transaction', authenticate, createTransaction);
export default router;
 