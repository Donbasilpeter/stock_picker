import { generatePortfolioService } from "../services/portfolioService.js";

export const generatePortfolio = async (req,res) =>{
    res.status(200).json( await generatePortfolioService(req.body.data.scripcodeArray ));
  }
