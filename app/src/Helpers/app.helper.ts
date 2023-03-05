import * as moment from "moment";
import { ParamsForEachStockApi, ResetStockInterface } from "src/Interfaces/stock.interface";
import StockPriceDto from "src/stock/dtos/create-stockPrice.dto";
import { GPU } from 'gpu.js';
import { noDataError } from "./objects.helper";


export const enumerateDaysBetweenDates =  (startDate, endDate)=>{
    let date = []
    for (var m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
        date.push(m.format('YYYY-MM-DD'));
    }
    return date;
  }

  export const fillAllDateWithData =  (stockPriceDto:StockPriceDto, params:ParamsForEachStockApi)=>{

  let allDate = enumerateDaysBetweenDates(params.fromdate, params.todate);
  let priceDataFlag = 0;
  if (stockPriceDto.Data && stockPriceDto.Data.length) {
    let modifiedData = allDate.map((thisDate) => {
      if (thisDate <= moment(new Date(stockPriceDto.Data[priceDataFlag].dttm)).format('YYYY-MM-DD')) {
        return {
          dttm: thisDate,
          vale1: stockPriceDto.Data[priceDataFlag].vale1,
          vole: stockPriceDto.Data[priceDataFlag].vole,
        };
      } else {
        if (priceDataFlag === stockPriceDto.Data.length - 1) {
          return {
            dttm: thisDate,
            vale1: stockPriceDto.Data[priceDataFlag].vale1,
            vole: stockPriceDto.Data[priceDataFlag].vole,
          };
        } else {
          priceDataFlag = priceDataFlag + 1;
          return {
            dttm: thisDate,
            vale1: stockPriceDto.Data[priceDataFlag].vale1,
            vole: stockPriceDto.Data[priceDataFlag].vole,
          };
        }
      }
    });
    return modifiedData;
  } else {
    throw {...noDataError,scripcode:parseInt(params.scripcode)};
  }
}

export const setParams = (resetStockInput:ResetStockInterface)=>{
  return  {paramsArray :resetStockInput.scripCodeArray.map((eachStock) => {
    return {
      scripcode: eachStock,
      flag: '1',
      seriesid: '',
      fromdate: resetStockInput.fromdate || '2013-01-01',
      todate: resetStockInput.todate || moment().format('YYYY-MM-DD'),
    };
  }),
  fromdate: resetStockInput.fromdate || '2013-01-01',
  todate: resetStockInput.todate || moment().format('YYYY-MM-DD'),

}
}

export const stockDataFormat = (data,params)=>{
  data.Data = JSON.parse(data.Data);
  data.scripcode = parseInt(params.scripcode);
  return data;
}
export const resultValidation = (data)=>{
  const successStocks = []
  const failedStocks = []

  data.map(eachOutput=>{
    if(eachOutput.scripcode && eachOutput.Scripname){
      successStocks.push(eachOutput.scripcode)
    }
    else{
      failedStocks.push(eachOutput.scripcode)
    }
  })
  if(failedStocks.length==0){
    return {status:"sucess",successStocks:successStocks}
  }
  else if(successStocks.length>0){
    return {status:"partial-sucess",successStocks:successStocks,failedStocks:failedStocks}
  }
  else{
    return {status:"failure",failedStocks:failedStocks}
  }
}



export const parallelCompute =(array)=>{
  const gpu = new GPU();
let parallelProcess = gpu
  .createKernel(function (array) {
    let id = this.thread.x;
    return array[id][0]*array[id][1] // do your work here

  })
  .setOutput([array.length]);

return  parallelProcess(array);

}

