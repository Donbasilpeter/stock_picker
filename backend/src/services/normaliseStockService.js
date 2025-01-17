import NormalisedStock from "../models/NormalisedStockModel.js";
import StockPrice from "../models/StockPriceModel.js"
import {
  getMax,
  getMin,
  resultValidation,
  stockToNormalisedStock,
} from "../utils/helper.js";

export const createNormalisedStockService = async () => {
  try {
    await NormalisedStock.collection.drop(); // Clear the existing data in the collection.

    const allData = await StockPrice.find({}).lean(); // Fetch all stock data.
    const normalisedData = allData.map(stockToNormalisedStock); // Normalize the data.

    // Calculate min and max values for normalization.
    const dailyMeanMin = getMin(normalisedData, 'dailyMean');
    const dailyMeanMax = getMax(normalisedData, 'dailyMean');
    const dailyStdDevMin = getMin(normalisedData, 'dailyStandardDeviation');
    const dailyStdDevMax = getMax(normalisedData, 'dailyStandardDeviation');

    // Normalize and save each stock one by one.
    for (const stock of normalisedData) {
      stock.NormalisedDailyMean =
        (stock.dailyMean - dailyMeanMin) / (dailyMeanMax - dailyMeanMin) + 1;
      stock.NormalisedDailyStandardDeviation =
        (stock.dailyStandardDeviation - dailyStdDevMin) /
        (dailyStdDevMax - dailyStdDevMin) +
        1;

      const normalizedStock = new NormalisedStock(stock);
      await normalizedStock.save(); // Save each document individually.
    }

    // Fetch and validate the result after saving.
    const savedData = await NormalisedStock.find({});
    return resultValidation(savedData);
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};



export const getnormalisedDataService= async () =>{
  return await NormalisedStock.find({}).select(
    'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation',
  );
}

export const getStockDataService = async (scripcode)=> {
  return await NormalisedStock.find({ scripcode: scripcode }).select(
    'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation normalisedData',
  );
}

// Service Implementation
export const searchStockListService = async ({ searchField, searchType, page }) => {
  const itemsPerPage = 10; // Number of items per page
  const skip = (page - 1) * itemsPerPage; // Calculate the number of items to skip

  if (searchType === 'Name') {
    return await NormalisedStock.find({
      Scripname: { $regex: searchField, $options: 'i' },
    })
      .skip(skip)
      .limit(itemsPerPage)
      .select(
        'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation',
      );
  } else if (searchType === 'CAGR' && !isNaN(Number(searchField))) {
    return await NormalisedStock.find({ cagr: { $gt: searchField } })
      .sort({ dailyStandardDeviation: 1 })
      .skip(skip)
      .limit(itemsPerPage)
      .select(
        'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation',
      );
  } else if (searchType === 'SD' && !isNaN(Number(searchField))) {
    return await NormalisedStock.find({
      dailyStandardDeviation: { $lt: searchField },
    })
      .sort({ cagr: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .select(
        'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation',
      );
  }
}