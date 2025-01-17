import {
    calculateDifferenceProbabilities,
    genPortfolio
  } from '../utils/helper.js';
import NormalisedStock from '../models/NormalisedStockModel.js';

export const generatePortfolioService = async (scripcodeArray)=> {
    return await NormalisedStock.find({
      scripcode: { $in: scripcodeArray },
    })
      .select(
        'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation normalisedData',
      )
      .then((selectedStocks) => {
        const portfolio = genPortfolio(selectedStocks);
        portfolio.stocks = scripcodeArray;
      
        const { dailyMean, Data: data } = portfolio;
        const growthFactor = 1 + dailyMean / 100;
        let prev = data[0].portfolioValue;
        
        // Generate the Ideal portfolio
        portfolio.Ideal = data.map((each, index) => {
          const value = index === 0 ? prev : (prev *= growthFactor);
          return { value, dttm: each.dttm };
        });
        
        portfolio.probability = calculateDifferenceProbabilities(portfolio.Ideal.map(each=>each.value),portfolio.Data.map(each=>each.portfolioValue))
        return portfolio;
        
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

