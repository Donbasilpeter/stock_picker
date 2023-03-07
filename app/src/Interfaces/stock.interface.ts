export interface DataInterface {
  dttm: Date;
  vale1:  number & Exclude<number, 0>
  vole: number;
}

export interface DataInterfaceNormalisedStock {
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

export interface AnalyseNormalisedStockInterface {
  coefficent : number,
  pfSize : number
}
export interface AnalyseNormalisedStockByCutInterface {
  SDcut : number,
  CAGRcut : number
}

export interface AnalyseNormalisedStockByCAGRInterface {
  pfSize : number,
  CAGRcut : number
}


