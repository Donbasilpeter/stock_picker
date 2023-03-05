import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { StockPrice,StockPriceSchema } from './schemas/test.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(
      'mongodb+srv://donbasilpeter:5FiuboLs3G5Nk0FH@cluster0.4un2gxl.mongodb.net/stock_list',
    ),
    MongooseModule.forFeature([{ name: StockPrice.name, schema: StockPriceSchema }]),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
