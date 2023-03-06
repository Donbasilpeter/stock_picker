import { Injectable } from '@nestjs/common';
import { stockToPortfolio } from 'src/Helpers/app.helper';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/StockPrice.schema';
import { Portfolio,PortfolioDocument } from 'src/schemas/portfolio.schema';

@Injectable()
export class PortfolioGeneratorService {
  constructor(
    @InjectModel(StockPrice.name)
    private StockPriceModel: Model<StockPriceDocument>,
    @InjectModel(Portfolio.name)
    private PortfolioModel: Model<PortfolioDocument>,
  ) {}

  createPortfolio() {
     return this.PortfolioModel.collection.drop().then(
      (()=>{
        return this.StockPriceModel.find({}).lean()
        .then((allData=>{
          return  allData.map((eachData)=>{
          const createdstock = new this.PortfolioModel(stockToPortfolio(eachData));
          createdstock.save();
          return createdstock.scripcode;
          })
    
        }))
        .catch((err) => {
          console.log(err)
          throw { status: err};
        });
      })
    )
    .then((data)=>data)
    .catch((err=>{return err}))
  }
}
