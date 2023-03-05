import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockModule } from './stock/stock.module';
import { PortfolioGeneratorModule } from './portfolio-generator/portfolio-generator.module';

import { HttpModule } from '@nestjs/axios';
import { GlobalHttpModule } from './global.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://donbasilpeter:5FiuboLs3G5Nk0FH@cluster0.4un2gxl.mongodb.net/stock_list',
    ),
    GlobalHttpModule,
    HttpModule,
    StockModule,
    PortfolioGeneratorModule,
  ],
})
export class AppModule {}
