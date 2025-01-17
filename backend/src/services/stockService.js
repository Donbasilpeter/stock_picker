import StockPrice from '../models/StockPriceModel.js'
import { fillAllDateWithData,stockDataFormat } from '../utils/helper.js';
import configLoader from '../config/baseApiConfiguration.js';
import axios from 'axios';

// Function to process stocks with a delay and progress
export const processStocksWithDelay = async (stocks) => {
    const total = stocks.length;
    let count = 0;

    for (const stock of stocks) {
        // Call the API to process the stock
        await createStocks(stock);

        // Increment the processed count
        count++;

        // Log progress (percentage of completion)
        const progress = Math.round((count / total) * 100);
        console.log(`Progress: ${progress}%`);
    }

    return ('All stocks processed!');
}


const createStocks = async ( params) => {
    try {
        const config = configLoader();
        const apiConfig = config.BseApiconfig;
        const baseUrl = config.bseBaseUrl;
        
        const data =  await axios.get(baseUrl, { ...apiConfig, params }).catch(err=>handleError(err))

        const stockPriceDto = stockDataFormat(data.data, params);
        const filledData = fillAllDateWithData(stockPriceDto, params);
        stockPriceDto.Data = filledData;

        const result = await StockPrice.findOneAndUpdate(
            { scripcode: params.scripcode },
            stockPriceDto,
            { upsert: true },
        );
        return stockPriceDto;
    } catch (err) {
        console.error('Error creating stock:', err);
        return {
            status: 'error',
            errorCode: err?.errno || 500,
            message: err.message,
            scripcode: err?.scripcode,
        };
    }
}

const handleError =(error) => {
    console.error('API error:', error);
    return throwError(() => new Error(`API request failed with status ${error.response?.status}`));
}

