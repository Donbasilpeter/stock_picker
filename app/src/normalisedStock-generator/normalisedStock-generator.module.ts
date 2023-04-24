import { Module } from '@nestjs/common';
import { NormalisedStockGeneratorService } from './normalisedStock-generator.service';
import { NormalisedStockGeneratorController } from './normalisedStock-generator.controller';

@Module({
  controllers: [NormalisedStockGeneratorController],
  providers: [NormalisedStockGeneratorService]
})
export class NormalisedStockGeneratorModule {}
