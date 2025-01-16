import { NormalisedStocks } from "./props";

export interface State {
  navbar: Navbar;
  normalisedStock: normalisedStocks,
  portfolio:PortfolioReducer
}

export interface Navbar {
  navItems: string[];
  currentNavItem: string;
}

export interface AppProps {
  store: State;
}
export interface normalisedStocks{
  normalisedStocks: NormalisedStocks[]
  selectedStock: number
  selectedStockData :SelectedStockData

}

export interface SelectedStockData {
  normalisedData:{
    dttm:string,
    normalisedData:number,
  }[],
  Scripname:string,
  NormalisedDailyMean:number,
  NormalisedDailyStandardDeviation:number,
  cagr:number,
  dailyMean:number,
  dailyStandardDeviation:number,
  scripcode:number,
  _id:string,
}

export interface PortfolioReducer {
portfolioStocks:number[]
portfolioStocksData:SelectedStockData[],
portfolio:Portfolio
searchResult:any[]
}

export interface Portfolio {
  Data: any[];
  arrayOfDailyChange: any[];
  dailyMean: number;
  dailyStandardDeviation: number;
  cagr: number;
  stocks:number[],
  Ideal:any[],
  probability:any,
}

