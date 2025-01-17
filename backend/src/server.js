import express from 'express';
import bodyParser from 'body-parser';
import { createCorsMiddleware } from './middlewares/corsMiddleware.js';
import dotenvConfig  from './config/dotenvConfig.js';
import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js'
import normalisedStockRoutes from './routes/normalisedStockRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'

import initializeDatabase from './config/db.js';



const app = express();
const port = 8000;

initializeDatabase()



app.use(createCorsMiddleware(process.env.CORS_ORIGIN)); // CORS middleware


app.use(bodyParser.json()); // Parse JSON requests

app.use('/auth', authRoutes); // Handle user registration and login
app.use('/', stockRoutes); 
app.use('/normalisedStock', normalisedStockRoutes); 
app.use('/normalisedStock', portfolioRoutes); 







app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
