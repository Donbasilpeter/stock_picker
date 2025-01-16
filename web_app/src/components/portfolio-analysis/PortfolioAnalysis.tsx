import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { State } from "../../interfaces/store";

import {
  addPortfolioStocksData,
  setPortfolio,
} from "../../reducers/portfolio";
import { generatePF, getSelectedStockData } from "../../services/apis";

import LineChart from "../line-chart/LineChart";
import { ListPortfolioStock } from "../listPortfolioStock/ListPortfolioStock";
import Search from "../Search/Search";
import EmptyPortfolio from "../empty-portfolio/EmptyPortfolio";
const PortfolioAnalysis: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const portfolioStocks = useSelector(
    (state: State) => state.portfolio.portfolioStocks
  );
  const portfolioStocksData = useSelector(
    (state: State) => state.portfolio.portfolioStocksData
  );
  const portfolio = useSelector((state: State) => state.portfolio.portfolio);


  useEffect(() => {
    if (portfolioStocks && portfolioStocks.length > 0) {
      portfolioStocks.map((eachStock) => {
        if (
          portfolioStocksData.filter(
            (element) => element.scripcode === eachStock
          ).length <= 0
        ) {
          getSelectedStockData(eachStock).then((data) => {
            if (data.status == "sucess") {
              let selectedStockData = data.data;
              dispatch(addPortfolioStocksData(selectedStockData));
            }
          });
        }
      });
      generatePortfolio();
    }
  }, [portfolioStocks]);

  

  const generatePortfolio = () => {
    generatePF(portfolioStocks).then((res) => {
      res.status === "sucess" && dispatch(setPortfolio(res.data));
    });
  };

  return (
    <> <Grid
      container
      sx={{
        pb: "1rem",
        pt: "5rem",
        px: "1rem",
        height: "100vh",
        width: "100%",
      }}
    >
      <Grid item xs={3}>
      <Search></Search>
        <Box sx={{ overflow: "auto", height: "76vh",mt:"2vh" }}>
          {portfolioStocksData?.map((eachStock) => {
            return (
              <ListPortfolioStock
                key={eachStock.scripcode}
                stockData={eachStock}
              />
            );
          })}
        </Box>
      </Grid>
      <Grid item xs={9}>
        {  (portfolioStocks.length>0 &&  portfolioStocksData.length>0) ? (<><Box
          position={"absolute"}
          sx={{ ml: 10, mt: 7, height: "10rem", width: "15rem" }}
        >
          <Card variant="outlined"      sx={{ px:2,pt:2,pb:3 }}>
          <Typography variant="h6"sx={{pb:1}}>  PORTFOLIO</Typography>

            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body1">  CAGR :</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" color="secondary">
                  {Math.round((portfolio.cagr + Number.EPSILON) * 100) /
                    100}%
                </Typography>
              </Grid>
              
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body1">Volatility :</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" color="secondary">
                  {Math.round((portfolio.dailyStandardDeviation + Number.EPSILON) * 100) /
                    100}
                </Typography>
              </Grid>
              
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body1"> Daily Mean :</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" color="secondary">
                  {Math.round((portfolio.dailyMean + Number.EPSILON) * 100) /
                    100}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body1"> GP :</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" color="secondary">
                  {Math.round((portfolio.probability?.P_higher*100 + Number.EPSILON) * 100) /
                    100}%
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Box>
        <LineChart
          lineChartData={portfolioStocksData}
          portfolioData={portfolio}
          isPortfolio={true}
        /> </>): <EmptyPortfolio/>}
      </Grid>
    </Grid>
    </>

  );
};

export default PortfolioAnalysis;
