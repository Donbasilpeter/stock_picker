import { Injectable } from '@nestjs/common';
import {
  dev,
  getMax,
  getMin,
  resultValidation,
  stockToNormalisedStock,
} from 'src/Helpers/app.helper';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/StockPrice.schema';
import {
  NormalisedStock,
  NormalisedStockDocument,
} from 'src/schemas/normalisedStock.schema';
import NormalisedStockDto from './dto/create-normalisedStock-generator.dto';
import {
  AnalyseNormalisedStockByCAGRInterface,
  AnalyseNormalisedStockByCutInterface,
  AnalyseNormalisedStockInterface,
  PortfolioData,
} from 'src/Interfaces/stock.interface';
import { Portfolio, PortfolioDocument } from 'src/schemas/portfolioschema';

@Injectable()
export class NormalisedStockGeneratorService {
  constructor(
    @InjectModel(StockPrice.name)
    private StockPriceModel: Model<StockPriceDocument>,
    @InjectModel(NormalisedStock.name)
    private NormalisedStockModel: Model<NormalisedStockDocument>,
    @InjectModel(Portfolio.name)
    private PortfolioModel: Model<PortfolioDocument>,
  ) {}

  createNormalisedStock() {
    return this.NormalisedStockModel.collection
      .drop()
      .then(()=>{
        return this.PortfolioModel.collection.drop()
      })
      .then(() => {
        return this.StockPriceModel.find({})
          .lean()
          .then((allData) => {
            return allData.map((eachData) => {
              return stockToNormalisedStock(eachData);
            });
          })
          .then((normalisedStockOfOneStock) => {
            let dailyMeanMin = getMin(normalisedStockOfOneStock, 'dailyMean');
            let dailyMeanMax = getMax(normalisedStockOfOneStock, 'dailyMean');
            let dailyStandardDeviationMin = getMin(
              normalisedStockOfOneStock,
              'dailyStandardDeviation',
            );
            let dailyStandardDeviationMax = getMax(
              normalisedStockOfOneStock,
              'dailyStandardDeviation',
            );
            return normalisedStockOfOneStock.map(
              (eachNormalisedStock: NormalisedStockDto) => {
                eachNormalisedStock.NormalisedDailyMean =
                  (eachNormalisedStock.dailyMean - dailyMeanMin) /
                    (dailyMeanMax - dailyMeanMin) +
                  1;
                eachNormalisedStock.NormalisedDailyStandardDeviation =
                  (eachNormalisedStock.dailyStandardDeviation -
                    dailyStandardDeviationMin) /
                    (dailyStandardDeviationMax - dailyStandardDeviationMin) +
                  1;
                const createdstock = new this.NormalisedStockModel(
                  eachNormalisedStock,
                );
                createdstock.save().catch((err) => {
                  throw { status: err };
                });
                return eachNormalisedStock;
              },
            );
          })
          .then((normalisedStock) => {
            return resultValidation(normalisedStock);
          })
          .catch((err) => {
            console.log(err);
            throw { status: err };
          });
      })

      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  analyseDonIntex({
    coefficent = 1,
    pfSize = 20,
  }: AnalyseNormalisedStockInterface) {
    return this.NormalisedStockModel.find({})
      .lean()
      .then((normalizedStocks) => {
        let result = normalizedStocks
          .map((eachNormalizedStock: NormalisedStock) => {
            eachNormalizedStock['DonIndex'] =
              eachNormalizedStock.NormalisedDailyMean -
              coefficent * eachNormalizedStock.NormalisedDailyStandardDeviation;
            return eachNormalizedStock;
          })
          .sort(function (a, b) {
            var keyA = a['DonIndex'],
              keyB = b['DonIndex'];
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
        // .slice(0, pfSize)
        return result;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  analyseBySortingSD() {
    return this.NormalisedStockModel.find({})
      .lean()
      .then((normalizedStocks) => {
        let result = normalizedStocks.sort(function (a, b) {
          var keyA = a['dailyStandardDeviation'],
            keyB = b['dailyStandardDeviation'];
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
        // .slice(0, pfSize)
        return result;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }
  analyseBySortAndCut({
    SDcut = 1.7,
    CAGRcut = 20,
  }: AnalyseNormalisedStockByCutInterface) {
    return this.NormalisedStockModel.find({})
      .lean()
      .then((normalizedStocks) => {
        let result = normalizedStocks
          .filter((eachStock) => {
            return eachStock.dailyStandardDeviation < SDcut;
          })
          .filter((eachStock) => {
            return eachStock.cagr > CAGRcut;
          })
          .sort(function (a, b) {
            var keyA = a['dailyStandardDeviation'],
              keyB = b['dailyStandardDeviation'];
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

        return result;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }
  analyseByCagr({
    CAGRcut = 10,
    pfSize = 12,
  }: AnalyseNormalisedStockByCAGRInterface) {

    return this.PortfolioModel.find({CAGRcut:CAGRcut,pfSize:pfSize})
    .then((portfolio)=>{
      if(portfolio.length){
        return portfolio;
      }
      else{
        return this.NormalisedStockModel.find({})
        .lean()
        .then((normalizedStocks) => {
          let result = normalizedStocks.filter((eachStock) => {
            return eachStock.cagr > CAGRcut;
          });
          if (result.length < pfSize) {
            return {
              status: 'failure',
              message: 'No enough stocks with given CAGR',
            };
          }
          result = result
            .sort(function (a, b) {
              var keyA = a['dailyStandardDeviation'],
                keyB = b['dailyStandardDeviation'];
              if (keyA < keyB) return -1;
              if (keyA > keyB) return 1;
              return 0;
            })
            .slice(0, pfSize);
          return result;
        })
        .then((selectedStocks: NormalisedStockDocument[]) => {
          const createdPortfolio = new this.PortfolioModel(
            this.createPortfolio(selectedStocks,CAGRcut)
          );
          return createdPortfolio.save().catch((err) => {
            throw { status: err };
          });
           
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  }

  createPortfolio(arrayForPortfolio: NormalisedStockDocument[],CAGRcut) {
    let portfolioData = [];
    let totalData = arrayForPortfolio[0].Data.length;
    let pfSize = arrayForPortfolio.length;
    for (let i = 0; i < totalData; i++) {
      let currentDateDailyChangeSum = 0;
      for (let j = 0; j < pfSize; j++) {
        currentDateDailyChangeSum += arrayForPortfolio[j].Data[i].dailyChange;
      }
      portfolioData.push({
        portfolioValue:currentDateDailyChangeSum/pfSize,
        dttm:arrayForPortfolio[0].Data[i].dttm
      })
    }
    let dailyMean = 0
    portfolioData.map((data)=>
    data.portfolioValue
    ).forEach(function(item) {
      dailyMean += item;
  });
  dailyMean = dailyMean/totalData
    
    let portfolio = {
      pfSize :pfSize,
      CAGRcut : CAGRcut,
      portfolioStocks: arrayForPortfolio,
      Data :portfolioData,
      dailyMean:dailyMean,
      dailyStandardDeviation: dev(portfolioData.map((data)=>
      data.portfolioValue
      )),
      cagr: (Math.pow((((dailyMean)/100)+1),365)-1)*100
    }
    
    return portfolio;
  }
}
