import { Injectable } from '@nestjs/common';
import { getMax, getMin, resultValidation, stockToPortfolio } from 'src/Helpers/app.helper';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/StockPrice.schema';
import { Portfolio, PortfolioDocument } from 'src/schemas/portfolio.schema';
import PortfolioDto from './dto/create-portfolio-generator.dto';
import { AnalysePortfolioByCutInterface, AnalysePortfolioInterface } from 'src/Interfaces/stock.interface';

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
            return allData.map((eachData) => {
                return stockToPortfolio(eachData);
              })
            
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
            return portfolioOfOneStock.map(async (eachPortfolio: PortfolioDto) => {
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
              return await createdstock.save()
              .then(data=>{
                return data

              })
              .catch((err)=>{
                throw { status: err };
              })
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

  analyseDonIntex({coefficent=1,pfSize=20}:AnalysePortfolioInterface){
    return this.PortfolioModel.find({})
    .lean()
    .then((normalizedStocks)=>{
      let result =  normalizedStocks.map((eachNormalizedStock:Portfolio) =>{
        eachNormalizedStock["DonIndex"] = eachNormalizedStock.NormalisedDailyMean - coefficent*eachNormalizedStock.NormalisedDailyStandardDeviation
        return eachNormalizedStock
      } )
      .sort(function(a, b) {
        var keyA = a["DonIndex"],
          keyB = b["DonIndex"];
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      })
      // .slice(0, pfSize)
      return result
    })
    .catch((err)=>{
      console.log(err)
      return(err)
    })
  }

  analyseBySortingSD(){
    return this.PortfolioModel.find({})
    .lean()
    .then((normalizedStocks)=>{
      let result = normalizedStocks
      .sort(function(a, b) {
        var keyA = a["dailyStandardDeviation"],
          keyB = b["dailyStandardDeviation"];
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      })
      // .slice(0, pfSize)
      return result
    })
    .catch((err)=>{
      console.log(err)
      return(err)
    })
  }
  analyseBySortAndCut({SDcut = 1.7,CAGRcut =20}:AnalysePortfolioByCutInterface){
    return this.PortfolioModel.find({})
    .lean()
    .then((normalizedStocks)=>{
      let result = normalizedStocks
      .filter((eachStock)=>{
        return eachStock.dailyStandardDeviation < SDcut
      })
      .filter((eachStock)=>{
        return eachStock.cagr > CAGRcut
      })
      .sort(function(a, b) {
        var keyA = a["dailyStandardDeviation"],
          keyB = b["dailyStandardDeviation"];
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      })


      return result
    })
    .catch((err)=>{
      console.log(err)
      return(err)
    })
  }
}
