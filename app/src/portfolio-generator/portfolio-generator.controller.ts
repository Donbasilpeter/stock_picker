import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PortfolioGeneratorService } from './portfolio-generator.service';
import { CreatePortfolioGeneratorDto } from './dto/create-portfolio-generator.dto';
import { UpdatePortfolioGeneratorDto } from './dto/update-portfolio-generator.dto';

@Controller('portfolio-generator')
export class PortfolioGeneratorController {
  constructor(private readonly portfolioGeneratorService: PortfolioGeneratorService) {}

  @Post()
  create(@Body() createPortfolioGeneratorDto: CreatePortfolioGeneratorDto) {
    return this.portfolioGeneratorService.createPortfolio();
  }

  
}
