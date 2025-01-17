import moment from 'moment';
import { noDataError, noEnoughDataError } from './errorData.js';

export const enumerateDaysBetweenDates = (startDate, endDate) => {
  let date = [];
  for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
    date.push(m.format('YYYY-MM-DD'));
  }
  return date;
};

export const fillAllDateWithData = (
  stockPriceDto,
  params
) => {
  let allDate = enumerateDaysBetweenDates(params.fromdate, params.todate);
  if (stockPriceDto.Data.length <= (allDate.length * 2) / 3) {
    console.log(noEnoughDataError);
    throw noEnoughDataError;
  } else {
    let priceDataFlag = 0;
    if (stockPriceDto.Data && stockPriceDto.Data.length) {
      let modifiedData = allDate.map((thisDate) => {
        const formattedDate = moment(thisDate).format('YYYY-MM-DD');
        if (
          formattedDate <= moment(new Date(stockPriceDto.Data[priceDataFlag].dttm)).format('YYYY-MM-DD')
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
      console.log(noDataError);
      throw { ...noDataError, scripcode: parseInt(params.scripcode) };
    }
  }
};

export const setParams = (resetStockInput) => {
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
  // Ensure data.Data is a valid JSON string before parsing
  if (typeof data.Data === 'string') {
    data.Data = JSON.parse(data.Data);
  }
  data.Data.map((eachValue) => {
    eachValue.vale1 = parseInt(eachValue.vale1);
    if (eachValue.vale1 === 0) eachValue.vale1 = 1; // Ensure vale1 is never zero
  });
  data.scripcode = parseInt(params.scripcode);
  return data;
};

export const resultValidation = (data) => {
  const successStocks = [];
  const failedStocks = [];

  data.forEach((eachOutput) => {
    if (eachOutput.scripcode && eachOutput.Scripname && eachOutput.Data) {
      successStocks.push(eachOutput.scripcode);
    } else {
      failedStocks.push(eachOutput.scripcode);
    }
  });

  if (failedStocks.length === 0) {
    return { status: 'success', successStocks: successStocks };
  } else if (successStocks.length > 0) {
    return {
      status: 'partial-success',
      successStocks: successStocks,
      failedStocks: failedStocks,
    };
  } else {
    return { status: 'failure', failedStocks: failedStocks };
  }
};

export const stockToNormalisedStock = (data) => {
  let output = {};
  let Data = [];
  let dailySum = 0;
  let arrayOfDailyChange = [];
  const BaseData = data.Data[0].vale1;
  const normalisedData = [{ dttm: data.Data[0].dttm, normalisedData: 100 }];

  for (let i = 1; i < data.Data.length; i++) {
    let dailyChange =
      ((data.Data[i].vale1 - data.Data[i - 1].vale1) * 100) / data.Data[i - 1].vale1;
    dailySum = dailySum + dailyChange;
    Data.push({ dttm: data.Data[i].dttm, dailyChange: dailyChange });
    arrayOfDailyChange.push(dailyChange);
    normalisedData.push({
      dttm: data.Data[i].dttm,
      normalisedData: (data.Data[i].vale1 * 100) / BaseData,
    });
  }

  output['Scripname'] = data.Scripname;
  output['scripcode'] = data.scripcode;
  output['Data'] = Data;
  output['dailyStandardDeviation'] = dev(arrayOfDailyChange);
  output['dailyMean'] = dailySum / Data.length;

  // Ensure the mean is positive before calculating CAGR
  const dailyMean = dailySum / Data.length;
  output['cagr'] = dailyMean > 0 ? (Math.pow(((dailyMean / 100) + 1), 365) - 1) * 100 : 0;
  output['normalisedData'] = normalisedData;

  return output;
};

export function dev(arr) {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(
    arr
      .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
      .reduce((acc, val) => acc + val, 0) / arr.length,
  );
}

export function getMin(data, key) {
  return data.reduce((min, p) => (p[key] < min ? p[key] : min), data[0][key]);
}

export function getMax(data, key) {
  return data.reduce((max, p) => (p[key] > max ? p[key] : max), data[0][key]);
}

export function calculateDifferenceProbabilities(idealArray, actualArray) {
  if (idealArray.length !== actualArray.length) {
    throw new Error("Both arrays must have the same length.");
  }

  const n = idealArray.length;

  if (n === 0) {
    throw new Error("Arrays cannot be empty.");
  }

  // Step 1: Calculate the last difference
  const lastDifference = (actualArray[n - 1] - idealArray[n - 1]) / idealArray[n - 1];

  // Step 2: Initialize counters for values higher and lower than the last difference
  let higherCount = 0;
  let lowerCount = 0;

  // Step 3: Iterate and count directly
  for (let i = 0; i < n; i++) {
    if (idealArray[i] === 0) {
      throw new Error("Ideal array values cannot be zero.");
    }

    const diff = (actualArray[i] - idealArray[i]) / idealArray[i];

    if (diff > lastDifference) {
      higherCount++;
    } else if (diff < lastDifference) {
      lowerCount++;
    }
  }

  // Step 4: Calculate probabilities
  const P_higher = higherCount / n;
  const P_lower = lowerCount / n;

  return { P_higher, P_lower };
}


export const genPortfolio = (arrayForPortfolio)=> {
  let portfolioData = [];
  let totalData = arrayForPortfolio[0].normalisedData.length;
  let pfSize = arrayForPortfolio.length;
  for (let i = 0; i < totalData; i++) {
    let currentDateNormalisedDataSum = 0;
    for (let j = 0; j < pfSize; j++) {
      currentDateNormalisedDataSum +=
        arrayForPortfolio[j].normalisedData[i].normalisedData;
    }
    portfolioData.push({
      portfolioValue: currentDateNormalisedDataSum / pfSize,
      dttm: arrayForPortfolio[0].normalisedData[i].dttm,
    });
  }

  let dailySum = 0;
  let arrayOfDailyChange = [];
  for (let i = 1; i < portfolioData.length; i++) {
    let dailyChange =
      ((portfolioData[i].portfolioValue -
        portfolioData[i - 1].portfolioValue) *
        100) /
      portfolioData[i - 1].portfolioValue;
    dailySum = dailySum + dailyChange;
    arrayOfDailyChange.push({
      dttm: portfolioData[i].dttm,
      dailyChange: dailyChange,
    });
  }
  let portfolio = {
    Data: portfolioData,
    arrayOfDailyChange: arrayOfDailyChange,
    dailyMean: dailySum / (totalData-1),
    dailyStandardDeviation: dev(
      arrayOfDailyChange.map((eachData) => eachData.dailyChange),
    ),
    cagr: (Math.pow(dailySum / (totalData-1) / 100 + 1, 365) - 1) * 100,
    stocks:[],
    Ideal:[],
    probability:{}
  };

  return portfolio;
}
