import express from 'express';
import { auth } from './middleware';
import { CustomRequest } from './interfaces/express.type';
import { getUserById, loginUser, registerUser } from './controller/user.controller';
import { createAccount, deleteAccount, getAccounts, getAccount } from './controller/account.controller';
import { createCategory, deleteCategory, getCategories, getCategory } from './controller/category.controller';
import { createTransaction, getTransactions } from './controller/transaction.controller';
import upload, { uploadFile } from './utils/upload';


const router = express.Router();


router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/user/', auth);
router.get('/user/transactions', auth);

// router.get('/user/:id', authenticate, getUser);


router.get('/accounts', auth, getAccounts);
router.post('/account', auth, createAccount);
router.get('/account/:id', auth, getAccount);
router.delete('/account/:id', auth, deleteAccount);


router.get('/categories', auth, getCategories);
router.post('/category', auth, createCategory);
router.get('/category/:id', auth, getCategory);
router.delete('/category/:id', auth, deleteCategory);


router.post('/transaction', auth, createTransaction);
router.get('/transactions', auth, getTransactions);

router.post('/upload', auth, upload.single('slip'), uploadFile);

export default router;
 