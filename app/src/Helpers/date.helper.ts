import * as moment from "moment";
import { ParamsForEachStockApi } from "src/Interfaces/stock.interface";
import StockPriceDto from "src/stock/dtos/create-stockPrice.dto";

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
      let date = moment(stockPriceDto.Data[priceDataFlag].dttm).format('YYYY-MM-DD');
      if (thisDate <= date) {
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
    throw {
      message: 'No data is found for the given period',
      errno: 404,
    };
  }
}