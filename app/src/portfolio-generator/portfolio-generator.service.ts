import { Injectable } from '@nestjs/common';
import { stockToPortfolio } from 'src/Helpers/app.helper';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/StockPrice.schema';
import { Portfolio, PortfolioDocument } from 'src/schemas/portfolio.schema';

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
                const createdstock = new this.PortfolioModel(
                  stockToPortfolio(eachData),
                );
                createdstock.save();
                return createdstock;
              }),
            );
          })
          .catch((err) => {
            console.log(err);
            throw { status: err };
          });
      })
      // .then(
      //   //portfolio of more than 1 stocks
      //   (portfolioOfOneStock) => {
      //     // for (let i = 1; i < portfolioOfOneStock.length; i++) {

      //     // }
      //     let allPortfolio = []
      //    countDown(portfolioOfOneStock,2,portfolioOfOneStock.length,allPortfolio)
      //    console.log(allPortfolio)
      //   },
      // )
      .catch((err) => {
        return err;
      });
  }
}

// // program to count down numbers to 1
// function countDown(portfolioOfNthLength,currentLength,limit,allPortfolio) {


// let portfolioOfN1thLength = []

//   if (portfolioOfN1thLength > limit) {
//     countDown(portfolioOfN1thLength,currentLength+1,limit,allPortfolio);
//   }

// }