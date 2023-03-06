import {  IsNotEmpty } from 'class-validator';
import { DataInterfacePortfolio } from 'src/Interfaces/stock.interface';

export class PortfolioDto {

  @IsNotEmpty()
  Scripname: string[];

  @IsNotEmpty()
  scripcode: number[];

  @IsNotEmpty()
  dailyMean: number;

  @IsNotEmpty()
  dailyStandardDeviation: number;

  @IsNotEmpty()
  cagr: number;

  @IsNotEmpty()
  Data: DataInterfacePortfolio[]
}

export default PortfolioDto;