import express from 'express';
import { resetAllstocks } from '../controllers/stockController.js';

const router = express.Router();

// User registration
router.get('/stock', resetAllstocks);

export default router;
