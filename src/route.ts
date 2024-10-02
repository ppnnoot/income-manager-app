import express from 'express';
import multer from 'multer';
import { auth } from './middleware';
import { loginUser, registerUser } from './controller/user.controller';
import { createAccount, deleteAccount, getAccounts, getAccount } from './controller/account.controller';
import { createCategory, deleteCategory, getCategories, getCategory } from './controller/category.controller';
import { createTransaction, getTransactions, getTransactionSummary } from './controller/transaction.controller';
import upload, { uploadFile } from './utils/upload';


const router = express.Router();


router.post('/login', loginUser);
router.post('/register', registerUser);


router.get('/accounts', auth, getAccounts);
router.post('/accounts', auth, createAccount);
router.get('/accounts/:id', auth, getAccount);
router.delete('/accounts/:id', auth, deleteAccount);


router.get('/categorry', auth, getCategories);
router.post('/category', auth, createCategory);
router.get('/category/:id', auth, getCategory);
router.delete('/category/:id', auth, deleteCategory);


router.post('/transactions', auth, createTransaction);
router.get('/transactions', auth, getTransactions);
router.get('/transactions/summary', auth, getTransactionSummary);


router.post('/upload', auth, upload.single('slip'), uploadFile);

export default router;
