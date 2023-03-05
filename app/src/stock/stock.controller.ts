import {
  Controller,
  Post,
  Body,

} from '@nestjs/common';
import { ResetStockInterface } from 'src/Interfaces/stock.interface';
import { StockService } from './stock.service';
import {  setParams } from 'src/Helpers/app.helper';
import { DateValidationError } from 'src/Helpers/objects.helper';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  async resetAllstocks(@Body() resetStockInput: ResetStockInterface) {
    const paramsArray = setParams(resetStockInput)
    const result = await Promise.all(
      paramsArray.map((eachStock) => {
        if (eachStock.fromdate <= eachStock.todate) {
          return this.stockService.createStocks(eachStock);
        } else {
          return DateValidationError;
        }
      }),
    );
    return result;
  }
}
