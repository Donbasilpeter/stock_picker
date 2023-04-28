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

@Controller('normalisedStock')
export class NormalisedStockGeneratorController {
  constructor(
    private readonly normalisedStockGeneratorService: NormalisedStockGeneratorService,
  ) {}
  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Get('/get-normalised-data')
  @ApiOperation({
    summary: 'This API allows you to fetch all the normalised stock metadata',
  })
  getnormalisedData() {
    return this.normalisedStockGeneratorService.getnormalisedData();
  }

  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Get('/get-stock-data')
  getStockData(@Query() query: { scripcode: number }) {
    return this.normalisedStockGeneratorService.getStockData(query.scripcode);
  }
  
  @ApiTags('API for Calculations') //api tag for swagger documentation
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
  
  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Post('/generate-portfolio')
  generatePortfolio(@Body() query: { data: { scripcodeArray: number[] } }) {
    return this.normalisedStockGeneratorService.generatePortfolio(
      query.data.scripcodeArray,
    );
  }
  
  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Post('/don-index')
  analyseDonIntex(@Body() resetStockInput: AnalyseNormalisedStockInterface) {
    return this.normalisedStockGeneratorService.analyseDonIntex(
      resetStockInput,
    );
  }  

  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Post('analyse-by-sorting-SD')
  analyseBySortingSD() {
    return this.normalisedStockGeneratorService.analyseBySortingSD();
  }
  
  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Post('analyse-by-sort-cut-SD')
  analyseBySortAndCut(
    @Body() AnalyseNormalisedStockByCut: AnalyseNormalisedStockByCutInterface,
  ) {
    return this.normalisedStockGeneratorService.analyseBySortAndCut(
      AnalyseNormalisedStockByCut,
    );
  }
  
  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Post('analyse-by-CAGR')
  analyseByCagr(@Body() analyseByCagr: AnalyseNormalisedStockByCAGRInterface) {
    return this.normalisedStockGeneratorService.analyseByCagr(analyseByCagr);
  }
}
