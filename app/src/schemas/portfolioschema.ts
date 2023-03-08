import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataInterfaceNormalisedStock, PortfolioData } from 'src/Interfaces/stock.interface';
import { HydratedDocument } from 'mongoose';
import PortfolioDto from 'src/normalisedStock-generator/dto/create.portfolio.dto';

export type PortfolioDocument = HydratedDocument<Portfolio>;
@Schema()
export class Portfolio {


  @Prop({type:Number,required: true})
  pfSize: number;

  @Prop({type: Number,required: true})
  CAGRcut: number;

  @Prop({type: Number,required: true})
  dailyMean: number;

  @Prop({type: Number,required: true})
  dailyStandardDeviation: number;
  
  @Prop({type: Number,required: true})
  cagr: number;

  @Prop({type: Array<PortfolioData>,required: true })
  Data: PortfolioData[]

  @Prop({type: Array<PortfolioDto>,required: true })
  portfolioStocks: PortfolioDto[] ;

  @Prop({type: Array<DataInterfaceNormalisedStock>,required: true })
  arrayOfDailyChange: DataInterfaceNormalisedStock[] ;


}
export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
