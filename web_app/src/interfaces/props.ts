
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



