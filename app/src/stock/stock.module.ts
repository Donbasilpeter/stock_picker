import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockPrice,StockPriceSchema } from '../schemas/StockPrice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import config from '../configuration'



@Module({

  imports:[
    HttpModule,
    MongooseModule.forFeature([{ name: StockPrice.name, schema: StockPriceSchema }]),
    ConfigModule.forRoot({
      load: [config]
    }),
  ],
  controllers: [StockController],
  providers: [StockService]
})
export class StockModule {}
