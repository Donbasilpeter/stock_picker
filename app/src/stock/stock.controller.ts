import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResetStockInterface } from 'src/Interfaces/stock.interface';
import { StockService } from './stock.service';
import * as moment from 'moment';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  async resetAllstocks(@Body() resetStockInput: ResetStockInterface) {
    const paramsArray = resetStockInput.scripCodeArray.map((eachStock) => {
      return {
        scripcode: eachStock,
        flag: '1',
        seriesid: '',
        fromdate: resetStockInput.fromdate || '2013-01-01',
        todate: resetStockInput.todate || moment().format('YYYY-MM-DD'),
      };
    });
    const result = await Promise.all(
      paramsArray.map((eachStock) => {
        if (eachStock.fromdate <= eachStock.todate) {
          return this.stockService.createStocks(eachStock);
        } else {
          return {
            status: 'error',
            errorCode: 403,
            message: 'From-Date must be greater than To-Date',
          };
        }
      }),
    );
    return result;
  }
}
