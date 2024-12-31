import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/StockPrice.schema';
import { ConfigService } from '@nestjs/config';
import { StockPriceDto } from './dtos/create-stockPrice.dto';
import { ApiErrorInterFace } from 'src/Interfaces/error.interface';
import { ParamsForEachStockApi } from 'src/Interfaces/stock.interface';
import { fillAllDateWithData, stockDataFormat } from 'src/Helpers/app.helper';

@Injectable()
export class StockService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(StockPrice.name)
    private StockPriceModel: Model<StockPriceDocument>,
    private readonly configService: ConfigService,
  ) {}

  async createStocks(
    params: ParamsForEachStockApi,
  ): Promise<StockPrice | ApiErrorInterFace> {
    try {
      const config = this.configService.get('BseApiconfig');
      const { data } = await firstValueFrom(
        this.httpService
          .get(this.configService.get('bseBaseUrl'), { ...config, params })
          .pipe(catchError((error: AxiosError) => this.handleError(error))),
      );

      const stockPriceDto: StockPriceDto = stockDataFormat(data, params);
      const filledData = fillAllDateWithData(stockPriceDto, params);
      stockPriceDto.Data = filledData;

      const result = await this.StockPriceModel.findOneAndUpdate(
        { scripcode: params.scripcode },
        stockPriceDto,
        { upsert: true },
      );
      return stockPriceDto;
    } catch (err) {
      console.error('Error creating stock:', err);
      return {
        status: 'error',
        errorCode: err?.errno || 500,
        message: err.message,
        scripcode: err?.scripcode,
      };
    }
  }

  private handleError(error: AxiosError) {
    console.error('API error:', error);
    return throwError(() => new Error(`API request failed with status ${error.response?.status}`));
  }

  // Function to process stocks with a delay and progress
  async processStocksWithDelay(stocks: ParamsForEachStockApi[]): Promise<void> {
    const total = stocks.length;
    let count = 0;

    for (const stock of stocks) {
      // Call the API to process the stock
      await this.createStocks(stock);

      // Increment the processed count
      count++;

      // Log progress (percentage of completion)
      const progress = Math.round((count / total) * 100);
      console.log(`Progress: ${progress}%`);
    }

    console.log('All stocks processed!');
  }
}
