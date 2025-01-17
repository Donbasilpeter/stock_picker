import { createNormalisedStock } from "../services/normaliseStockService.js";
export const create = async (req,res) => {
  res.status(200).json({ res: await createNormalisedStock() });
}