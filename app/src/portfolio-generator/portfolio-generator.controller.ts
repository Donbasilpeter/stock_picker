import { Controller, Post, Body } from '@nestjs/common';
import { AnalysePortfolioInterface } from 'src/Interfaces/stock.interface';
import { PortfolioGeneratorService } from './portfolio-generator.service';


@Controller('portfolio')
export class PortfolioGeneratorController {
  constructor(private readonly portfolioGeneratorService: PortfolioGeneratorService) {}

  @Post("/normalise-stocks")
  create() {
    return this.portfolioGeneratorService.createPortfolio();
  }

  @Post("/don-index")
  analyseDonIntex(@Body() resetStockInput: AnalysePortfolioInterface) {
    return this.portfolioGeneratorService.analyseDonIntex(resetStockInput);

  }
  @Post("analyse")
  analyse() {
    return this.portfolioGeneratorService.analyse();

  }

  
}
