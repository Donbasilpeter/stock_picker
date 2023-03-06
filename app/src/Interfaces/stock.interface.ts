export interface DataInterface {
  dttm: Date;
  vale1: number;
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

