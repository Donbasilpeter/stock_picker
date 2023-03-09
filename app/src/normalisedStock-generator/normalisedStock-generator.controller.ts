import { Controller, Post, Body, Get } from '@nestjs/common';
import { AnalyseNormalisedStockByCAGRInterface, AnalyseNormalisedStockByCutInterface, AnalyseNormalisedStockInterface } from 'src/Interfaces/stock.interface';
import { NormalisedStockGeneratorService } from './normalisedStock-generator.service';


@Controller('normalisedStock')
export class NormalisedStockGeneratorController {
  constructor(private readonly normalisedStockGeneratorService: NormalisedStockGeneratorService) {}

  @Get("/get-normalised-data")
  get() {
    return this.normalisedStockGeneratorService.getnormalisedData();
  }

  @Post("/normalise-stocks")
  create() {
    return this.normalisedStockGeneratorService.createNormalisedStock();
  }

  @Post("/don-index")
  analyseDonIntex(@Body() resetStockInput: AnalyseNormalisedStockInterface) {
    return this.normalisedStockGeneratorService.analyseDonIntex(resetStockInput);

  }
  @Post("analyse-by-sorting-SD")
  analyseBySortingSD() {
    return this.normalisedStockGeneratorService.analyseBySortingSD();

  }

  @Post("analyse-by-sort-cut-SD")
  analyseBySortAndCut(@Body() AnalyseNormalisedStockByCut: AnalyseNormalisedStockByCutInterface) {
    return this.normalisedStockGeneratorService.analyseBySortAndCut(AnalyseNormalisedStockByCut);

  }

  @Post("analyse-by-CAGR")
  analyseByCagr(@Body() analyseByCagr: AnalyseNormalisedStockByCAGRInterface) {
    return this.normalisedStockGeneratorService.analyseByCagr(analyseByCagr);

  }

  
}
