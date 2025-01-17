import express from 'express';
import { create } from '../controllers/normaliseStockController.js';

const router = express.Router();

// User registration
router.post('/normalise-stocks', create);

export default router;
