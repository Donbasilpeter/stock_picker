import express from 'express';
import { generatePortfolio } from '../controllers/portfolioController.js';

const router = express.Router();

// User registration
router.post('/generate-portfolio', generatePortfolio);

export default router;
