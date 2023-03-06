import { Controller, Post } from '@nestjs/common';
import { PortfolioGeneratorService } from './portfolio-generator.service';


@Controller('normalise-stocks')
export class PortfolioGeneratorController {
  constructor(private readonly portfolioGeneratorService: PortfolioGeneratorService) {}

  @Post()
  create() {
    return this.portfolioGeneratorService.createPortfolio();
  }

  
}
