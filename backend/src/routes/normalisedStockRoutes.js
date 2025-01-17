import express from 'express';
import { createNormalisedStock,searchStockList,getStockData,getnormalisedData } from '../controllers/normaliseStockController.js';

const router = express.Router();

// User registration
router.post('/normalise-stocks', createNormalisedStock);
router.get('/get-normalised-data', getnormalisedData);
router.get('/get-stock-data', getStockData);
router.get('/search-stock-list', searchStockList);


export default router;
