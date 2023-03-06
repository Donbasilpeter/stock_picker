import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataInterfacePortfolio } from 'src/Interfaces/stock.interface';
import { HydratedDocument } from 'mongoose';

export type PortfolioDocument = HydratedDocument<Portfolio>;
@Schema()
export class Portfolio {


  @Prop({unique:true,type:String,required: true})
  Scripname: string;

  @Prop({unique:true,type: Number,required: true})
  scripcode: number;

  @Prop({type: Number,required: true})
  dailyMean: number;

  @Prop({type: Number,required: true})
  dailyStandardDeviation: number;
  
  @Prop({type: Number,required: true})
  cagr: number;

  @Prop({type: Number,required: true})
  NormalisedDailyMean: number;

  @Prop({type: Number,required: true})
  NormalisedDailyStandardDeviation: number;

  @Prop({type: Array<DataInterfacePortfolio>,required: true })
  Data: DataInterfacePortfolio[]

}
export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
