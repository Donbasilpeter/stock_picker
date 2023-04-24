import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockModule } from './stock/stock.module';
import { NormalisedStockGeneratorModule } from './normalisedStock-generator/normalisedStock-generator.module';

import { HttpModule } from '@nestjs/axios';
import { GlobalHttpModule } from './global.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MOGO_DB_URL
    ),
    GlobalHttpModule,
    HttpModule,
    StockModule,
    NormalisedStockGeneratorModule,
  ],
})
export class AppModule {}
