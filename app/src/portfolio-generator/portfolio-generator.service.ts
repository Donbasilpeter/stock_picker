import { Injectable } from '@nestjs/common';
import { getMax, getMin, resultValidation, stockToPortfolio } from 'src/Helpers/app.helper';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/StockPrice.schema';
import { Portfolio, PortfolioDocument } from 'src/schemas/portfolio.schema';
import PortfolioDto from './dto/create-portfolio-generator.dto';

@Injectable()
export class PortfolioGeneratorService {
  constructor(
    @InjectModel(StockPrice.name)
    private StockPriceModel: Model<StockPriceDocument>,
    @InjectModel(Portfolio.name)
    private PortfolioModel: Model<PortfolioDocument>,
  ) {}

  createPortfolio() {
    return this.PortfolioModel.collection
      .drop()
      .then(() => {
        return this.StockPriceModel.find({})
          .lean()
          .then((allData) => {
            return Promise.all(
              allData.map((eachData) => {
                return stockToPortfolio(eachData);
              }),
            );
          })
          .then((portfolioOfOneStock) => {
            let dailyMeanMin = getMin(portfolioOfOneStock, 'dailyMean');
            let dailyMeanMax = getMax(portfolioOfOneStock, 'dailyMean');
            let dailyStandardDeviationMin = getMin(
              portfolioOfOneStock,
              'dailyStandardDeviation',
            );
            let dailyStandardDeviationMax = getMax(
              portfolioOfOneStock,
              'dailyStandardDeviation',
            );
            return portfolioOfOneStock.map((eachPortfolio: PortfolioDto) => {
              eachPortfolio.NormalisedDailyMean =
                (eachPortfolio.dailyMean - dailyMeanMin) /
                  (dailyMeanMax - dailyMeanMin) +
                1;
              eachPortfolio.NormalisedDailyStandardDeviation =
                (eachPortfolio.dailyStandardDeviation -
                  dailyStandardDeviationMin) /
                  (dailyStandardDeviationMax - dailyStandardDeviationMin) +
                1;
              const createdstock = new this.PortfolioModel(eachPortfolio);
              createdstock.save();
              return eachPortfolio;
            });

             
          })
          .then((normalisedStock)=>{return resultValidation(normalisedStock)})
          .catch((err) => {
            console.log(err);
            throw { status: err };
          });
      })

      .catch((err) => {
        console.log(err)
        return err;
      });
  }

  analyse(){
    return this.StockPriceModel.find({})
    .lean()
    .then((normalizedStocks)=>{
      console.log(normalizedStocks)
      return normalizedStocks
    })
  }
}
