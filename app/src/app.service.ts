import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'
import { StockPrice, StockPriceDocument } from './schemas/test.schema';


@Injectable()
export class AppService {
  private  config = {
    headers: {
      'User-Agent':
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36',
    },
    params:{}
  };
 private readonly url = 'https://api.bseindia.com/BseIndiaAPI/api/StockReachGraph/w'
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(StockPrice.name) private StockPriceModel: Model<StockPriceDocument>

  ) {}
  async updateStocks(): Promise<any> {
    this.config.params = {scripcode:"500109",flag:"1",fromdate:"2021-11-01",todate:"2021-12-12",seriesid:""}
    let { data } = await firstValueFrom(
      this.httpService.get(this.url, this.config).pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw 'An error happened!';
        }),
      ),
    );
    data.Data = JSON.parse(data.Data)
    return data;
  }
}
