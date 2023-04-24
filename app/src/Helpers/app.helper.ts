import * as moment from 'moment';
import {
  ParamsForEachStockApi,
  ResetStockInterface,
} from 'src/Interfaces/stock.interface';
import StockPriceDto from 'src/stock/dtos/create-stockPrice.dto';
import { GPU } from 'gpu.js';
import { noDataError, noEnoughDataError } from './objects.helper';

export const enumerateDaysBetweenDates = (startDate, endDate) => {
  let date = [];
  for (var m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
    date.push(m.format('YYYY-MM-DD'));
  }
  return date;
};

export const fillAllDateWithData = (
  stockPriceDto: StockPriceDto,
  params: ParamsForEachStockApi,
) => {
  let allDate = enumerateDaysBetweenDates(params.fromdate, params.todate);
  if(stockPriceDto.Data.length <= allDate.length*2/3){
    console.log(noEnoughDataError)
    throw noEnoughDataError
  }
  else{

  let priceDataFlag = 0;
  if (stockPriceDto.Data && stockPriceDto.Data.length) {
    let modifiedData = allDate.map((thisDate) => {
      if (
        thisDate <=
        moment(new Date(stockPriceDto.Data[priceDataFlag].dttm)).format(
          'YYYY-MM-DD',
        )
      ) {
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
    console.log(noDataError)
    throw { ...noDataError, scripcode: parseInt(params.scripcode) };
  }
}
};

export const setParams = (resetStockInput: ResetStockInterface) => {
  return {
    paramsArray: resetStockInput.scripCodeArray.map((eachStock) => {
      return {
        scripcode: eachStock,
        flag: '1',
        seriesid: '',
        fromdate: resetStockInput.fromdate || '2016-01-01',
        todate: resetStockInput.todate || moment().format('YYYY-MM-DD'),
      };
    }),
    fromdate: resetStockInput.fromdate || '2016-01-01',
    todate: resetStockInput.todate || moment().format('YYYY-MM-DD'),
  };
};

export const stockDataFormat = (data, params) => {
  data.Data = JSON.parse(data.Data);
  data.Data.map((eachValue) => {
    (eachValue.vale1 = parseInt(eachValue.vale1))
    if (eachValue.vale1 === 0) eachValue.vale1 = 1
  });
  data.scripcode = parseInt(params.scripcode);
  return data;
};
export const resultValidation = (data) => {
  const successStocks = [];
  const failedStocks = [];

  data.map((eachOutput) => {
    if (eachOutput.scripcode && eachOutput.Scripname && eachOutput.Data) {
      successStocks.push(eachOutput.scripcode);
    } else {
      failedStocks.push(eachOutput.scripcode);
    }
  });
  if (failedStocks.length == 0) {
    return { status: 'sucess', successStocks: successStocks };
  } else if (successStocks.length > 0) {
    return {
      status: 'partial-sucess',
      successStocks: successStocks,
      failedStocks: failedStocks,
    };
  } else {
    return { status: 'failure', failedStocks: failedStocks };
  }
};

// export const convertIntoNormalisedStockParallely =(array1,array2)=>{
//   const gpu = new GPU();
//   let value = []
// let parallelProcess = gpu
//   .createKernel(function (array1) {

//       value.push(this.thread.x)
//       return 1

//   })
//   .setOutput([4]);

// let x =  parallelProcess(array1);

// return x
// }

export const stockToNormalisedStock = (data) => {
  let output = {};

  let Data = [];
  let dailySum = 0;
  let arrayOfDailyChange = [];
  let BaseData:number = data.Data[0].vale1
  let normalisedData = [{dttm:data.Data[0].dttm, normalisedData:100}]


  for (let i = 1; i < data.Data.length; i++) {
    let dailyChange = ((data.Data[i].vale1 - data.Data[i - 1].vale1) * 100) / data.Data[i - 1].vale1;
    dailySum = dailySum + dailyChange;
    Data.push({ dttm: data.Data[i].dttm, dailyChange: dailyChange });
    arrayOfDailyChange.push(dailyChange);
    normalisedData.push({ dttm: data.Data[i].dttm, normalisedData: (data.Data[i].vale1)*100/BaseData  });

    
  }
  output['Scripname'] = data.Scripname;
  output['scripcode'] = data.scripcode;
  output['Data'] = Data;
  output['dailyStandardDeviation'] = dev(arrayOfDailyChange);
  output['dailyMean'] = dailySum / Data.length;
  output['cagr'] = (Math.pow((((dailySum/ Data.length)/100)+1),365)-1)*100;
  output['normalisedData'] = normalisedData;






  return output
};

export function dev(arr) {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(
    arr
      .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
      .reduce((acc, val) => acc + val, 0) / arr.length,
  );
}


export function getMin(data,key) {
  return data.reduce((min, p) => p[key] < min ? p[key] : min, data[0][key]);
}
export function getMax(data,key) {
  return data.reduce((max, p) => p[key] > max ? p[key] : max, data[0][key]);
}
