import { setParams } from '../utils/helper.js';
import { DateValidationError } from '../utils/errorData.js';
import { processStocksWithDelay } from '../services/stockService.js';


export const resetAllstocks  = async (req, res)=>{
  const { paramsArray, fromdate, todate } = setParams(req.body);
  if (fromdate <= todate) {
     const result = await processStocksWithDelay(paramsArray);  // Call the delayed processing
     res.status(200).json({ res: result });

  } else {
    console.log(DateValidationError);
    res.status(403).json({ res: DateValidationError });
  }
}