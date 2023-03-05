import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://donbasilpeter:5FiuboLs3G5Nk0FH@cluster0.4un2gxl.mongodb.net/stock_list',
    ),
    StockModule,
  ],
})
export class AppModule {}
