import { Controller, Post, Body, Get, Param, Query, Req } from '@nestjs/common';
import { query } from 'express';
import { Input } from 'gpu.js';
import { AnalyseNormalisedStockByCAGRInterface, AnalyseNormalisedStockByCutInterface, AnalyseNormalisedStockInterface } from 'src/Interfaces/stock.interface';
import { NormalisedStockGeneratorService } from './normalisedStock-generator.service';


@Controller('normalisedStock')
export class NormalisedStockGeneratorController {
  constructor(private readonly normalisedStockGeneratorService: NormalisedStockGeneratorService) {}

  @Get("/get-normalised-data")
  getnormalisedData() {
    return this.normalisedStockGeneratorService.getnormalisedData();
  }
  @Post("/generate-portfolio")
  generatePortfolio(@Body() query: {data:{scripcodeArray:number[]}}) {
    return this.normalisedStockGeneratorService.generatePortfolio(query.data.scripcodeArray);
  }

    @Get("/get-stock-data")
    getStockData( @Query() query: {scripcode: number}) {
    return this.normalisedStockGeneratorService.getStockData(query.scripcode);
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
