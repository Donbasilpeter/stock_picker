import { Box } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { State } from "../../interfaces/store";
import {
  setNormalisedStocks,
  setSelectedStock,
} from "../../reducers/normalisedStock";
import { getNormalisedStockSdCagrValues } from "../../services/apis";

import ScatterChart from "../scatter-chart/ScatterChart";
const MarketViewer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const NormalisedStocksList = useSelector(
    (state: State) => state.normalisedStock.normalisedStocks
  );

  const labelAndApicall = function (tooltipItem: any) {
    return (
      "Name : " +
      tooltipItem.raw.labeldata +
      " (CAGR : " +
      tooltipItem.parsed.y +
      "%, SD : " +
      tooltipItem.parsed.x +
      ")"
    );
  };

  const onSelection = function (event: any, elements: any) {
    if (elements.length > 0) {
      const currentElement = elements[0].element.$context.raw.scripcode
      dispatch(setSelectedStock(currentElement));
      navigate("/stock-analysis/"+currentElement);
    }
  };

  useEffect(() => {
    getNormalisedStockSdCagrValues().then((data) => {
      if (data.status == "sucess") {
        let normalisedScatterChartData = data.data.map((eachStock: any) => {
          return {
            x: eachStock.dailyStandardDeviation,
            y: eachStock.cagr,
            labeldata: eachStock.Scripname,
            scripcode: eachStock.scripcode,
          };
        });
        dispatch(setNormalisedStocks(normalisedScatterChartData));
      }
    });
  }, []);

  return (
    <Box sx={{ mx: 2 }}>
      <ScatterChart
        scatterChartData={NormalisedStocksList}
        labelAndApicall={labelAndApicall}
        onSelection={onSelection}
      />
    </Box>
  );
};

export default MarketViewer;
