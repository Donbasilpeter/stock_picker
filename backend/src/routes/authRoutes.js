import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// User registration
router.post('/register', registerUser);

// User login -
router.post('/login', loginUser);

export default router;
