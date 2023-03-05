import { Module } from '@nestjs/common';
import { PortfolioGeneratorService } from './portfolio-generator.service';
import { PortfolioGeneratorController } from './portfolio-generator.controller';

@Module({
  controllers: [PortfolioGeneratorController],
  providers: [PortfolioGeneratorService]
})
export class PortfolioGeneratorModule {}
