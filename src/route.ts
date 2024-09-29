import express from 'express';
import { loginUser, registerUser } from './controller/controller.user';

const router = express.Router();

// Route register
router.post('/register', registerUser);

// Route login
router.post('/login', loginUser);



export default router;
