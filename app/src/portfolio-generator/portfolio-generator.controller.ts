import { Controller, Post, Body } from '@nestjs/common';
import { AnalysePortfolioByCAGRInterface, AnalysePortfolioByCutInterface, AnalysePortfolioInterface } from 'src/Interfaces/stock.interface';
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
  @Post("analyse-by-sorting-SD")
  analyseBySortingSD() {
    return this.portfolioGeneratorService.analyseBySortingSD();

  }

  @Post("analyse-by-sort-cut-SD")
  analyseBySortAndCut(@Body() AnalysePortfolioByCut: AnalysePortfolioByCutInterface) {
    return this.portfolioGeneratorService.analyseBySortAndCut(AnalysePortfolioByCut);

  }

  @Post("analyse-by-CAGR")
  analyseByCagr(@Body() analyseByCagr: AnalysePortfolioByCAGRInterface) {
    return this.portfolioGeneratorService.analyseByCagr(analyseByCagr);

  }

  
}
