import {  IsNotEmpty,IsNumber,IsString,IsArray } from 'class-validator';
import { DataInterfacePortfolio } from 'src/Interfaces/stock.interface';

export class PortfolioDto {

  @IsNotEmpty()
  @IsString()
  Scripname: string;

  @IsNotEmpty()
  @IsNumber()
  scripcode: number;

  @IsNotEmpty()
  @IsNumber()
  dailyMean: number;

  @IsNotEmpty()
  @IsNumber()
  dailyStandardDeviation: number;

  @IsNumber()
  @IsNotEmpty()
  NormalisedDailyMean: number;

  @IsNumber()
  @IsNotEmpty()
  NormalisedDailyStandardDeviation: number;

  @IsNotEmpty()
  @IsNumber()
  cagr: number;

  @IsNotEmpty()
  @IsArray()
  Data: DataInterfacePortfolio[]
}

export default PortfolioDto;