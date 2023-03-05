import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/StockPrice.schema';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class StockService {

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(StockPrice.name)
    private StockPriceModel: Model<StockPriceDocument>,
    private readonly configService: ConfigService
  ) {}
  
  async createStocks(): Promise<any> {
    let config = this.configService.get('BseApiconfig');
     config.params = {
      scripcode: '500109',
      flag: '1',
      fromdate: '2021-11-01',
      todate: '2021-12-12',
      seriesid: '',
    };
    let { data } = await firstValueFrom(
      this.httpService.get(this.configService.get('bseBaseUrl'),config).pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw 'An error happened!';
        }),
      ),
    );
    data.Data = JSON.parse(data.Data);
    return data;
  }
}
