import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
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
    let config = this.configService.get('BseApiconfig');
    let data = await firstValueFrom(
      this.httpService
        .get(this.configService.get('bseBaseUrl'), { ...config, params })
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error)
            throw error;
          }),
        ),
    )
      .then(({ data }) => stockDataFormat(data,params))
      .then((stockPriceDto: StockPriceDto) => {
        const filledData = fillAllDateWithData(stockPriceDto,params)
        stockPriceDto.Data = filledData;
        return stockPriceDto;
      })
      .then((stockPriceDto: StockPriceDto) => {
        return this.StockPriceModel.findOneAndUpdate(
          { scripcode: params.scripcode },
          stockPriceDto,
        ).then((data) => {
          if (data && data.scripcode) {
            return stockPriceDto;
          } else {
            const createdstock = new this.StockPriceModel(stockPriceDto);
            return createdstock.save();
          }
        });
      })
      .catch((err) => {
        console.log(err)
        return {
          status: 'error',
          errorCode: err.errno ? err.errno : 403,
          message: err.message,
          scripcode:err?.scripcode
        };
      });
    return data;
  }
}
