import { useEffect } from "react";
import { useSelector,useDispatch } from 'react-redux'
import { State } from "../../interfaces/store";
import { setNormalisedStocks } from "../../reducers/normalisedStock";
import { getNormalisedStockSdCagrValues } from "../../services/apis";



import ScatterChart from "../scatter-chart/ScatterChart";
const StockAnalysisChart:React.FunctionComponent = ()=>{
 const dispatch = useDispatch()
 const NormalisedStocksList = useSelector(
    (state: State) => state.normalisedStock.normalisedStocks
  );

useEffect(() => {
     getNormalisedStockSdCagrValues().then((data)=>{
        if(data.status == "sucess"){
            let normalisedScatterChartData = data.data.map((eachStock:any)=>{
                return {x:eachStock.dailyStandardDeviation,y:eachStock.dailyMean,labeldata:eachStock.Scripname}
            })
            dispatch(setNormalisedStocks(normalisedScatterChartData))
        }
    })

  },[]);

    return(
        <ScatterChart scatterChartData={NormalisedStocksList} />
    )

}

export default StockAnalysisChart;