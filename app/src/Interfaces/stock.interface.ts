export interface DataInterface {
  dttm: Date;
  vale1:  number & Exclude<number, 0>
  vole: number;
}

export interface DataInterfacePortfolio {
  dttm: Date;
  dailyChange: number;
}

export interface ParamsForEachStockApi {
  scripcode: string
  flag: string,
  fromdate: string,
  todate: string,
  seriesid: string,
};
export interface ResetStockInterface {
  scripCodeArray: string[]
  fromdate?: string,
  todate?: string,
};

export interface AnalysePortfolioInterface {
  coefficent : number,
  pfSize : number
}
export interface AnalysePortfolioByCutInterface {
  SDcut : number,
  CAGRcut : number
}

export interface AnalysePortfolioByCAGRInterface {
  pfSize : number,
  CAGRcut : number
}


