import { Controller, Post } from '@nestjs/common';
import { PortfolioGeneratorService } from './portfolio-generator.service';


@Controller('portfolio')
export class PortfolioGeneratorController {
  constructor(private readonly portfolioGeneratorService: PortfolioGeneratorService) {}

  @Post("/normalise-stocks")
  create() {
    return this.portfolioGeneratorService.createPortfolio();
  }

  @Post("/analyse")
  analyse() {
    return this.portfolioGeneratorService.analyse();

  }

  
}
