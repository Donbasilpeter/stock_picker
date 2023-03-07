import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StockPrice, StockPriceSchema } from './schemas/StockPrice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import config from './configuration'
import { NormalisedStock, NormalisedStockSchema } from './schemas/normalisedStock.schema';
import { Portfolio, PortfolioSchema } from './schemas/portfolioschema';

@Global()
@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: StockPrice.name, schema: StockPriceSchema },
    ]),
    MongooseModule.forFeature([
      { name: NormalisedStock.name, schema: NormalisedStockSchema },
    ]),
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
    ]),
    ConfigModule.forRoot({
        isGlobal:true,
        load: [config]
      }),
  ],
  exports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: StockPrice.name, schema: StockPriceSchema },
    ]),
    MongooseModule.forFeature([
      { name: NormalisedStock.name, schema: NormalisedStockSchema },
    ]),
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
    ]),
    ConfigModule.forRoot({
        isGlobal:true,
        load: [config]
      }),
  ],
})
export class GlobalHttpModule {}
