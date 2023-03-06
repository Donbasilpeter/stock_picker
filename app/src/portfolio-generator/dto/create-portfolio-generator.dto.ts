import {  IsNotEmpty,IsNumber,IsString } from 'class-validator';
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
  NormalisedDailyMean: number;

  @IsNumber()
  NormalisedDailyStandardDeviation: number;

  @IsNotEmpty()
  @IsNumber()
  cagr: number;

  @IsNotEmpty()
  Data: DataInterfacePortfolio[]
}

export default PortfolioDto;