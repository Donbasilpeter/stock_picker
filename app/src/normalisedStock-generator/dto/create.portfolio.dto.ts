import {  IsNotEmpty,IsNumber,IsString,IsArray } from 'class-validator';
import { DataInterfaceNormalisedStock, PortfolioData } from 'src/Interfaces/stock.interface';
import NormalisedStockDto from './create-normalisedStock-generator.dto';

export class PortfolioDto {






  @IsNotEmpty()
  @IsNumber()
  pfSize: number;

  @IsNotEmpty()
  @IsNumber()
  CAGRcut: number;

  @IsNotEmpty()
  @IsNumber()
  dailyMean: number;

  @IsNotEmpty()
  @IsNumber()
  dailyStandardDeviation: number;

  @IsNotEmpty()
  @IsArray()
  portfolioStocks: NormalisedStockDto[] ;

  @IsNotEmpty()
  @IsNumber()
  cagr: number;

  @IsNotEmpty()
  @IsArray()
  Data: PortfolioData[]
}

export default PortfolioDto;