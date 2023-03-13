import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { State } from "../../interfaces/store";
import {
  setSelectedStock,
  setSelectedStockData,
} from "../../reducers/normalisedStock";
import { addPortfolioStock, removePortfolioStock, removePortfolioStocksData } from "../../reducers/portfolio";
import { getSelectedStockData } from "../../services/apis";
import LineChart from "../line-chart/LineChart";
const StockAnalysis: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedStock = useSelector(
    (state: State) => state.normalisedStock.selectedStock
  );
  const selectedStockData = useSelector(
    (state: State) => state.normalisedStock.selectedStockData
  );
  const portfolioStocks = useSelector(
    (state: State) => state.portfolio.portfolioStocks
  );
  const portfolio = useSelector(
    (state: State) => state.portfolio.portfolio
  );
  

  useEffect(() => {
    if (selectedStock) {
      getSelectedStockData(selectedStock).then((data) => {
        if (data.status == "sucess") {
          let selectedStockData = data.data;
          dispatch(setSelectedStockData(selectedStockData));
        }
      });
    } else {
      let url = window.location.href;
      let scripcode = url.substring(url.lastIndexOf("/") + 1);
      dispatch(setSelectedStock(scripcode));
    }
  }, [selectedStock]);

  return (
    <Grid
      container
      sx={{ pb: "1rem", pt: "5rem", px: "1rem", height: "100%", width: "100%" }}
    >
      <Grid item xs={3}>
        <Grid container sx={{ pl: "1rem", pt: "2rem" }}>
          <Grid item xs={6}>
            <Typography variant="h6"> Equity Name</Typography>
            <Typography variant="body1" color="secondary">
              {selectedStockData.Scripname}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6"> Equity Code</Typography>
            <Typography variant="body1" color="secondary">
              {selectedStockData.scripcode}
            </Typography>
          </Grid>
        </Grid>
        <Grid container sx={{ pl: "1rem", pt: "5rem " }}>
          <Grid item xs={6}>
            <Typography variant="h6"> CAGR</Typography>
            <Typography variant="body1" color="secondary">
              {Math.round((selectedStockData.cagr + Number.EPSILON) * 100) /
                100}
              %
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6"> Volatility</Typography>
            <Typography variant="body1" color="secondary">
              {Math.round(
                (selectedStockData.dailyStandardDeviation + Number.EPSILON) *
                  100
              ) / 100}

              {}
            </Typography>
          </Grid>
        </Grid>
        <Grid container sx={{ pl: "1rem", pt: "5rem" }}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
         {  !portfolioStocks.includes(selectedStockData.scripcode)?

            <Button
             
              variant="contained"
              onClick={() => {
                dispatch(addPortfolioStock(selectedStockData.scripcode));
              }}
            >
              Add to P-G
            </Button>
            :
            <Button
             
            variant="contained"
            onClick={() => {
              dispatch(removePortfolioStocksData(selectedStockData.scripcode));
              dispatch(removePortfolioStock(selectedStockData.scripcode));
            }}
          >
            Remove from P-G
          </Button>
            
}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        <LineChart lineChartData={[selectedStockData]} portfolioData ={portfolio} />
      </Grid>
    </Grid>
  );
};

export default StockAnalysis;
