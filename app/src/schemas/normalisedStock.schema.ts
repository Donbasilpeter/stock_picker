import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataInterfaceNormalisedStock, NormalisedDataInterfaceNormalisedStock } from 'src/Interfaces/stock.interface';
import { HydratedDocument } from 'mongoose';

export type NormalisedStockDocument = HydratedDocument<NormalisedStock>;
@Schema()
export class NormalisedStock {


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

  @Prop({type: Array<DataInterfaceNormalisedStock>,required: true })
  Data: DataInterfaceNormalisedStock[]

  @Prop({type: Array<NormalisedDataInterfaceNormalisedStock>,required: true })
  normalisedData: NormalisedDataInterfaceNormalisedStock[]

}
export const NormalisedStockSchema = SchemaFactory.createForClass(NormalisedStock);
