import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { State } from "../../interfaces/store";

import {
  addPortfolioStock,
  removePortfolioStock,
  addPortfolioStocksData,
  setPortfolio,
  setSearchResult,
} from "../../reducers/portfolio";
import { generatePF, getSelectedStockData, searchStockList } from "../../services/apis";

import LineChart from "../line-chart/LineChart";
import { ListPortfolioStock } from "../listPortfolioStock/ListPortfolioStock";
import Search from "../Search/Search";
const PortfolioAnalysis: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchField, setSearchField] = useState("");
  const [searchColumn, setSearchColumn] = useState("Name");
  const [dropDownArray, setDropDownArray] = useState(["Name","CAGR","SD"]);


  const portfolioStocks = useSelector(
    (state: State) => state.portfolio.portfolioStocks
  );
  const portfolioStocksData = useSelector(
    (state: State) => state.portfolio.portfolioStocksData
  );
  const portfolio = useSelector((state: State) => state.portfolio.portfolio);
  const searchResult = useSelector((state: State) => state.portfolio.searchResult);


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
  useEffect(() => {
    if(searchField&&searchColumn)
    searchStockList(searchColumn,searchField)
    .then((data)=>{data.status ==="sucess" && dispatch(setSearchResult(data.data))})
  }, [searchField,searchColumn]);



  

  const generatePortfolio = () => {
    generatePF(portfolioStocks).then((res) => {
      res.status === "sucess" && dispatch(setPortfolio(res.data));
    });
  };

  return (
    <>{  portfolioStocks.length>0 &&  portfolioStocksData.length>0 &&  <Grid
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
      <Search
            dropDownValues={searchResult}
          setSearchField={setSearchField}
          dropDownArray={dropDownArray}
          setSearchColumn={setSearchColumn}
        ></Search>
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

        {/* <Grid container justifyContent="center" sx={{ pt: 5 }}>
          <Button
            variant="outlined"
            onClick={() => {
              generatePortfolio();
            }}
          >
            {portfolio.stocks.length === 0
              ? "Generate Portfolio"
              : "Regenerate Portfolio"}
          </Button>
        </Grid> */}
      </Grid>
      <Grid item xs={9}>
        <Box
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
          </Card>
        </Box>
        <LineChart
          lineChartData={portfolioStocksData}
          portfolioData={portfolio}
          isPortfolio={true}
        />
      </Grid>
    </Grid>}
    </>

  );
};

export default PortfolioAnalysis;
