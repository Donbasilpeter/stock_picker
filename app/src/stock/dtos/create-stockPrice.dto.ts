import { IsString, IsNotEmpty,IsDate,IsNumber } from 'class-validator';
import { DataInterface } from 'src/Interfaces/stock.interface';

export class StockPriceDto {

  @IsDate()
  CurrDate: Date;

  @IsNumber()
  PrevClose: number;

  @IsNumber()
  LowVal: number;

  @IsNumber()
  HighVal: number;

  @IsString()
  Scripname: string;

  @IsNumber()
  CurrVal: number;

  @IsString()
  CurrTime: string;

  @IsNumber()
  LowVol: number;

  @IsNumber()
  HighVol: number;

  @IsNumber()
  code: number;

  @IsNotEmpty()
  Data: DataInterface[]
}

export default StockPriceDto;