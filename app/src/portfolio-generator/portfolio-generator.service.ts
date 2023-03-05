import { Injectable } from '@nestjs/common';
import { parallelCompute } from 'src/Helpers/app.helper';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/StockPrice.schema';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PortfolioGeneratorService {

  createPortfolio() {
    const array = [
      [1, 2],
      [4, 5],
      [9, 13],
    ];

    return parallelCompute(array);
  }
}
