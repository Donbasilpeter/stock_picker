import { Box } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { State } from "../../interfaces/store";
import {
   setSelectedStockData,
} from "../../reducers/normalisedStock";
import { getSelectedStockData } from "../../services/apis";

import LineChart from "../line-chart/LineChart";
const StockAnalysisChart: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedStock = useSelector(
    (state: State) => state.normalisedStock.selectedStock
  );
  const selectedStockData = useSelector(
    (state: State) => state.normalisedStock.selectedStockData
  );



  useEffect(() => {
    getSelectedStockData(selectedStock).then((data) => {
      if (data.status == "sucess") {
        let selectedStockData = data.data
        dispatch(setSelectedStockData(selectedStockData));
      }
    });
  }, [selectedStock]);


  return (
    <Box sx={{ mx: 2 }}>
      <LineChart LineChartData = {selectedStockData} />
    </Box>
  );
};

export default StockAnalysisChart;
