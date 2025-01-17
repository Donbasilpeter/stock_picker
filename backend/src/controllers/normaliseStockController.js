import { createNormalisedStockService,getnormalisedDataService,getStockDataService,searchStockListService } from "../services/normaliseStockService.js";

export const createNormalisedStock = async (req,res) => {
  res.status(200).json(await createNormalisedStockService());
}

export const getnormalisedData = async (req,res) =>{
  res.status(200).json(await getnormalisedDataService());

}

export const getStockData = async (req,res) =>{
  res.status(200).json(await getStockDataService(req.query.scripcode));

}

export const searchStockList = async (req,res) =>{
  res.status(200).json(await searchStockListService(req.query));

}
