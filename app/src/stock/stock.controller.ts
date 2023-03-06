import { Controller, Post, Body } from '@nestjs/common';
import { ResetStockInterface } from 'src/Interfaces/stock.interface';
import { StockService } from './stock.service';
import { resultValidation, setParams } from 'src/Helpers/app.helper';
import { DateValidationError } from 'src/Helpers/objects.helper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/StockPrice.schema';

@Controller('stock')
export class StockController {
  constructor(
    private readonly stockService: StockService,
    @InjectModel(StockPrice.name)
    private StockPriceModel: Model<StockPriceDocument>,
  ) {}

  @Post()
  async resetAllstocks(@Body() resetStockInput: ResetStockInterface) {
    this.StockPriceModel.collection.drop();
    const { paramsArray, fromdate, todate } = setParams(resetStockInput);
    if (fromdate <= todate) {
      const result = await Promise.all(
        paramsArray.map((eachStock, i) => {
          return this.stockService.createStocks(eachStock).then((data) => {
            console.log(i);
            return data;
          });
        }),
      );
      return resultValidation(result);
    } else {
      return DateValidationError;
    }
  }
}
