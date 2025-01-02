import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import {
  AnalyseNormalisedStockByCAGRInterface,
  AnalyseNormalisedStockByCutInterface,
  AnalyseNormalisedStockInterface,
} from 'src/Interfaces/stock.interface';
import { NormalisedStockGeneratorService } from './normalisedStock-generator.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { portfolioGeneratorSample } from 'src/scripcode';

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
  @ApiOperation({
    summary: 'This API allows you to fetch stock data by scriptcode',
  })
  @ApiQuery({
    name: 'scripcode',
    description: 'Script code of the stock',
    type: 'number',
    required: true,
    example: 500209,
  })
  getStockData(@Query() query: { scripcode: number }) {
    return this.normalisedStockGeneratorService.getStockData(query.scripcode);
  }
  
  @ApiTags('API for Calculations') // API tag for Swagger documentation
  @Get('/search-stock-list')
  @ApiOperation({
    summary: 'This API allows you to fetch stock by name, CAGR, SD',
    description: `You could filter out the stocks by entering a keyword that matches
      a string (for searching name), or stocks whose SD (risk factor) is below a particular
      value, or stocks whose CAGR is above a particular value.`,
  })
  @ApiQuery({
    name: 'searchField',
    description: 'Keyword for filtering stocks',
    type: 'string',
    required: true,
    example: 'TCS',
  })
  @ApiQuery({
    name: 'searchType',
    description: 'Filter type: CAGR, SD, or Name',
    type: 'string',
    required: true,
    example: 'Name',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    type: 'number',
    required: true,
    example: 1,
  })
  searchStockList(
    @Query() query: { searchType: string; searchField: number | string; page: number },
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
  @ApiOperation({
    summary:
      'This API allows you to generate a portfolio.',
    description: `
        This API generates and return a portfolio from given scripcodes with metadata`,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          items: { type: 'array' },
          description: 'An array of script codes',
          example:portfolioGeneratorSample
        },
      },

      required: ['scripCodeArray'],
    },
  })

  generatePortfolio(@Body() query: { data: { scripcodeArray: number[] } }) {
    return this.normalisedStockGeneratorService.generatePortfolio(
      query.data.scripcodeArray,
    );
  }

  
  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Post('/don-index')
  @ApiOperation({
    summary:
      'This API allows you to find best stocks based on don Index',
    description: `
        This API assigns a index value for all stocks and sort the stocks
        based on the index. the index is based on the coeffient value given. 
        its value can be varied from 1 to infinity.higher the value more importance is 
        given to the daily mean and less importance to risk factor.increase the value 
        if you cannot handle higher risks.The coeffient deterimines your risk taking
        capabilities`,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        coefficent: {
          type: 'number',
          description: 'enter the coefficent value',
          example:1
        },
      },

      required: ['scripCodeArray'],
    },
  })
  analyseDonIntex(@Body() resetStockInput: AnalyseNormalisedStockInterface) {
    return this.normalisedStockGeneratorService.analyseDonIntex(
      resetStockInput,
    );
  }  

  // @ApiTags('API for Calculations') //api tag for swagger documentation
  // @Post('analyse-by-sorting-SD')
  // analyseBySortingSD() {
  //   return this.normalisedStockGeneratorService.analyseBySortingSD();
  // }
  
  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Post('analyse-by-sort-cut-SD')
  @ApiOperation({
    summary:
      'This API allows you to filter out stocks based on SD and CAGR',
    description: `
        This API lists all stocks that has lower SD and higher CAGR than specified values`,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        SDcut: {
          type: 'number',
          description: 'enter the SD limit',
          example:1.5
        },
        CAGRcut: {
          type: 'number',
          description: 'enter the CAGR limit',
          example:20
        },
      },
    },
  })
  analyseBySortAndCut(
    @Body() AnalyseNormalisedStockByCut: AnalyseNormalisedStockByCutInterface,
  ) {
    return this.normalisedStockGeneratorService.analyseBySortAndCut(
      AnalyseNormalisedStockByCut,
    );
  }
  
  @ApiTags('API for Calculations') //api tag for swagger documentation
  @Post('analyse-by-CAGR')
  @ApiOperation({
    summary:
      'This API allows you to filter out stocks based on PFsize and CAGR',
    description: `
        This API lists top specified no of stocks that has higher CAGR than specified value`,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pfSize: {
          type: 'number',
          description: 'enter the PF size',
          example:12
        },
        CAGRcut: {
          type: 'number',
          description: 'enter the CAGR limit',
          example:10
        },
      },
    },
  })
  analyseByCagr(@Body() analyseByCagr: AnalyseNormalisedStockByCAGRInterface) {
    return this.normalisedStockGeneratorService.analyseByCagr(analyseByCagr);
  }
}
