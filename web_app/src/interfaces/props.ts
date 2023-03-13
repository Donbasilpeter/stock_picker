import { Portfolio, SelectedStockData } from "./store";

export interface HeaderDrawerProps {
  handleDrawerToggle: () => void;
  navItems: string[];
}


export interface NormalisedStocks {
  x: number;
  y: number;
  labeldata: string;
}

export interface ScatterChartDataProps {
  scatterChartData:NormalisedStocks[]
  labelAndApicall: (tooltipItem: any) => string,
  onSelection: (event: any, elements: any) => void
}



export interface LineDataInterfaceProps {
  lineChartData:SelectedStockData[],
  portfolioData:Portfolio,
  isPortfolio?:boolean,

}


export interface DataSetInterface 
  {
    label: string;
    data: any[];
    fill: boolean;
    borderColor?: string;
    backgroundColor?: string;
    color: string;
    tension: number;
}[]

export interface stockDataInterface {
  stockData:SelectedStockData
}

  
  
