import { Injectable } from '@nestjs/common';
import {
  calculateDifferenceProbabilities,
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

  getnormalisedData() {
    return this.NormalisedStockModel.find({}).select(
      'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation',
    );
  }

  getStockData(scripcode) {
    return this.NormalisedStockModel.find({ scripcode: scripcode }).select(
      'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation normalisedData',
    );
  }
  generatePortfolio(scripcodeArray) {
    return this.NormalisedStockModel.find({
      scripcode: { $in: scripcodeArray },
    })
      .select(
        'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation normalisedData',
      )
      .then((selectedStocks: NormalisedStockDocument[]) => {
        const portfolio = this.genPortfolio(selectedStocks);
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

// Service Implementation
searchStockList({ searchField, searchType, page }) {
  const itemsPerPage = 10; // Number of items per page
  const skip = (page - 1) * itemsPerPage; // Calculate the number of items to skip

  if (searchType === 'Name') {
    return this.NormalisedStockModel.find({
      Scripname: { $regex: searchField, $options: 'i' },
    })
      .skip(skip)
      .limit(itemsPerPage)
      .select(
        'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation',
      );
  } else if (searchType === 'CAGR' && !isNaN(Number(searchField))) {
    return this.NormalisedStockModel.find({ cagr: { $gt: searchField } })
      .sort({ dailyStandardDeviation: 1 })
      .skip(skip)
      .limit(itemsPerPage)
      .select(
        'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation',
      );
  } else if (searchType === 'SD' && !isNaN(Number(searchField))) {
    return this.NormalisedStockModel.find({
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

async createNormalisedStock() {
  try {
    await this.NormalisedStockModel.collection.drop();
    await this.PortfolioModel.collection.drop();

    const allData = await this.StockPriceModel.find({}).lean();
    const normalisedData = allData.map(stockToNormalisedStock);
    const dailyMeanMin = getMin(normalisedData, 'dailyMean');
    const dailyMeanMax = getMax(normalisedData, 'dailyMean');
    const dailyStdDevMin = getMin(normalisedData, 'dailyStandardDeviation');
    const dailyStdDevMax = getMax(normalisedData, 'dailyStandardDeviation');

    const normalizedStocks = normalisedData.map((stock:NormalisedStockDto) => {
      stock.NormalisedDailyMean =
        (stock.dailyMean - dailyMeanMin) / (dailyMeanMax - dailyMeanMin) + 1;
      stock.NormalisedDailyStandardDeviation =
        (stock.dailyStandardDeviation - dailyStdDevMin) /
          (dailyStdDevMax - dailyStdDevMin) +
        1;
      return stock;
    });

    await this.NormalisedStockModel.insertMany(normalizedStocks);

    return resultValidation(normalizedStocks);
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}
  analyseDonIntex({
    coefficent = 1,
    pfSize = 20,
  }: AnalyseNormalisedStockInterface) {
    return this.NormalisedStockModel.find({})
      .select(
        'Scripname scripcode dailyMean dailyStandardDeviation cagr NormalisedDailyMean NormalisedDailyStandardDeviation',
      )
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
    return this.PortfolioModel.find({ CAGRcut: CAGRcut, pfSize: pfSize })
      .then((portfolio) => {
        if (portfolio.length) {
          return portfolio[0];
        } else {
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
                this.createPortfolio(selectedStocks, CAGRcut),
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

  createPortfolio(arrayForPortfolio: NormalisedStockDocument[], CAGRcut) {
    let portfolioData = [];
    let totalData = arrayForPortfolio[0].normalisedData.length;
    let pfSize = arrayForPortfolio.length;
    for (let i = 0; i < totalData; i++) {
      let currentDateNormalisedDataSum = 0;
      for (let j = 0; j < pfSize; j++) {
        currentDateNormalisedDataSum +=
          arrayForPortfolio[j].normalisedData[i].normalisedData;
      }
      portfolioData.push({
        portfolioValue: currentDateNormalisedDataSum / pfSize,
        dttm: arrayForPortfolio[0].normalisedData[i].dttm,
      });
    }

    let dailySum = 0;
    let arrayOfDailyChange = [];
    for (let i = 1; i < portfolioData.length; i++) {
      let dailyChange =
        ((portfolioData[i].portfolioValue -
          portfolioData[i - 1].portfolioValue) *
          100) /
        portfolioData[i - 1].portfolioValue;
      dailySum = dailySum + dailyChange;
      arrayOfDailyChange.push({
        dttm: portfolioData[i].dttm,
        dailyChange: dailyChange,
      });
    }
    let portfolio = {
      pfSize: pfSize,
      CAGRcut: CAGRcut,
      portfolioStocks: arrayForPortfolio,
      Data: portfolioData,
      arrayOfDailyChange: arrayOfDailyChange,
      dailyMean: dailySum / (totalData-1),
      dailyStandardDeviation: dev(
        arrayOfDailyChange.map((eachData) => eachData.dailyChange),
      ),
      cagr: (Math.pow(dailySum / (totalData-1) / 100 + 1, 365) - 1) * 100,
    };

    return portfolio;
  }
  genPortfolio(arrayForPortfolio: NormalisedStockDocument[]) {
    let portfolioData = [];
    let totalData = arrayForPortfolio[0].normalisedData.length;
    let pfSize = arrayForPortfolio.length;
    for (let i = 0; i < totalData; i++) {
      let currentDateNormalisedDataSum = 0;
      for (let j = 0; j < pfSize; j++) {
        currentDateNormalisedDataSum +=
          arrayForPortfolio[j].normalisedData[i].normalisedData;
      }
      portfolioData.push({
        portfolioValue: currentDateNormalisedDataSum / pfSize,
        dttm: arrayForPortfolio[0].normalisedData[i].dttm,
      });
    }

    let dailySum = 0;
    let arrayOfDailyChange = [];
    for (let i = 1; i < portfolioData.length; i++) {
      let dailyChange =
        ((portfolioData[i].portfolioValue -
          portfolioData[i - 1].portfolioValue) *
          100) /
        portfolioData[i - 1].portfolioValue;
      dailySum = dailySum + dailyChange;
      arrayOfDailyChange.push({
        dttm: portfolioData[i].dttm,
        dailyChange: dailyChange,
      });
    }
    let portfolio = {
      Data: portfolioData,
      arrayOfDailyChange: arrayOfDailyChange,
      dailyMean: dailySum / (totalData-1),
      dailyStandardDeviation: dev(
        arrayOfDailyChange.map((eachData) => eachData.dailyChange),
      ),
      cagr: (Math.pow(dailySum / (totalData-1) / 100 + 1, 365) - 1) * 100,
      stocks:[],
      Ideal:[],
      probability:{}
    };

    return portfolio;
  }
}
