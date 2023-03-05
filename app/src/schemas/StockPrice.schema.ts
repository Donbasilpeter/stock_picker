import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataInterface } from 'src/Interfaces/stock.interface';
import { HydratedDocument } from 'mongoose';

export type StockPriceDocument = HydratedDocument<StockPrice>;
@Schema()
export class StockPrice {
  @Prop()
  CurrDate: Date;

  @Prop()
  PrevClose: number;

  @Prop()
  LowVal: number;

  @Prop()
  HighVal: number;

  @Prop({unique:true,type: String,required: true})
  Scripname: string;

  @Prop()
  CurrVal: number;

  @Prop()
  CurrTime: string;

  @Prop()
  LowVol: number;

  @Prop()
  HighVol: number;

  @Prop({unique:true,type: Number,required: true})
  scripcode: number;

  @Prop(Array<DataInterface>)
  Data: DataInterface[]
}
export const StockPriceSchema = SchemaFactory.createForClass(StockPrice);
