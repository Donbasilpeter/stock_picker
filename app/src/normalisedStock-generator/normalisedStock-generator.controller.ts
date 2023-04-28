import { Controller, Post, Body, Get, Param, Query, Req } from '@nestjs/common';
import { query } from 'express';
import { Input } from 'gpu.js';
import {
  AnalyseNormalisedStockByCAGRInterface,
  AnalyseNormalisedStockByCutInterface,
  AnalyseNormalisedStockInterface,
} from 'src/Interfaces/stock.interface';
import { NormalisedStockGeneratorService } from './normalisedStock-generator.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('API for Calculations') //api tag for swagger documentation
@Controller('normalisedStock')
export class NormalisedStockGeneratorController {
  constructor(
    private readonly normalisedStockGeneratorService: NormalisedStockGeneratorService,
  ) {}

  @Get('/get-normalised-data')
  @ApiOperation({
    summary: 'This API allows you to fetch all the normalised stock metadata',
  })
  getnormalisedData() {
    return this.normalisedStockGeneratorService.getnormalisedData();
  }

  @Get('/get-stock-data')
  getStockData(@Query() query: { scripcode: number }) {
    return this.normalisedStockGeneratorService.getStockData(query.scripcode);
  }

  @Get('/search-stock-list')
  searchStockList(
    @Query() query: { searchType: string; searchField: number | string },
  ) {
    return this.normalisedStockGeneratorService.searchStockList(query);
  }

  @ApiTags('API for Data Setup') //api tag for swagger documentation
  @Post('/normalise-stocks')
  //swagger config for this api
  @ApiOperation({
    summary:
      'This API allows you to reset the entire normalised data in the Database. ',
    description: `
      Use it carefully!
       It fetchs stored stock data form local database and normalise the data and store in another location. 
       It also add other analitics like daily standard deviation, daily mean etc.`,
  })
  create() {
    return this.normalisedStockGeneratorService.createNormalisedStock();
  }

  @Post('/generate-portfolio')
  generatePortfolio(@Body() query: { data: { scripcodeArray: number[] } }) {
    return this.normalisedStockGeneratorService.generatePortfolio(
      query.data.scripcodeArray,
    );
  }

  @Post('/don-index')
  analyseDonIntex(@Body() resetStockInput: AnalyseNormalisedStockInterface) {
    return this.normalisedStockGeneratorService.analyseDonIntex(
      resetStockInput,
    );
  }
  @Post('analyse-by-sorting-SD')
  analyseBySortingSD() {
    return this.normalisedStockGeneratorService.analyseBySortingSD();
  }

  @Post('analyse-by-sort-cut-SD')
  analyseBySortAndCut(
    @Body() AnalyseNormalisedStockByCut: AnalyseNormalisedStockByCutInterface,
  ) {
    return this.normalisedStockGeneratorService.analyseBySortAndCut(
      AnalyseNormalisedStockByCut,
    );
  }

  @Post('analyse-by-CAGR')
  analyseByCagr(@Body() analyseByCagr: AnalyseNormalisedStockByCAGRInterface) {
    return this.normalisedStockGeneratorService.analyseByCagr(analyseByCagr);
  }
}
