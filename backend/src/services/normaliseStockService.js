import NormalisedStock from "../models/NormalisedStockModel.js";
import StockPrice from "../models/StockPriceModel.js"
import {
  calculateDifferenceProbabilities,
  dev,
  getMax,
  getMin,
  resultValidation,
  stockToNormalisedStock,
} from "../utils/helper.js";

export const  createNormalisedStock = async () =>{
    try {
      await NormalisedStock.collection.drop();

      const allData = await StockPrice.find({}).lean();
      const normalisedData = allData.map(stockToNormalisedStock);
      const dailyMeanMin = getMin(normalisedData, 'dailyMean');
      const dailyMeanMax = getMax(normalisedData, 'dailyMean');
      const dailyStdDevMin = getMin(normalisedData, 'dailyStandardDeviation');
      const dailyStdDevMax = getMax(normalisedData, 'dailyStandardDeviation');
  
      const normalizedStocks = normalisedData.map((stock) => {
        stock.NormalisedDailyMean =
          (stock.dailyMean - dailyMeanMin) / (dailyMeanMax - dailyMeanMin) + 1;
        stock.NormalisedDailyStandardDeviation =
          (stock.dailyStandardDeviation - dailyStdDevMin) /
            (dailyStdDevMax - dailyStdDevMin) +
          1;
        return stock;
      });
  
      await NormalisedStock.insertMany(normalizedStocks);
  
      return resultValidation(normalizedStocks);
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  }