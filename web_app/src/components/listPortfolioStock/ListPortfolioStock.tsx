import { Button, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { stockDataInterface } from "../../interfaces/props";
import {
  addPortfolioStock,
  removePortfolioStock,
  removePortfolioStocksData,
} from "../../reducers/portfolio";

export const ListPortfolioStock = ({ stockData }: stockDataInterface) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  return (
    <>
         <Grid container sx={{ pl: "1rem", pt: "2rem" }}>
        <Grid item xs={6}>
          <Typography variant="h6"> Equity Name</Typography>
      
          <div  onClick={()=>{navigate("/stock-analysis/"+stockData.scripcode)}}>
          <Typography sx={{cursor:"pointer",textDecoration: 'underline'}} variant="body1" color="secondary">
            {stockData.Scripname}
          </Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6"> Equity Code</Typography>
          <div  onClick={()=>{navigate("/stock-analysis/"+stockData.scripcode)}}>
          <Typography sx={{cursor:"pointer",textDecoration: 'underline'}} variant="body1" color="secondary">
            {stockData.scripcode}
          </Typography>
          </div>

        </Grid>
      </Grid>
      <Grid container sx={{ pl: "1rem", pt: "2rem " }}>
        <Grid item xs={6}>
          <Typography variant="h6"> CAGR</Typography>
          <Typography variant="body1" color="secondary">
            {Math.round((stockData.cagr + Number.EPSILON) * 100) / 100}%
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6"> Volatility</Typography>
          <Typography variant="body1" color="secondary">
            {Math.round(
              (stockData.dailyStandardDeviation + Number.EPSILON) * 100
            ) / 100}

            {}
          </Typography>
        </Grid>
      </Grid>
      <Grid container sx={{ pl: "1rem", pt: "1rem",pb:"2rem" }}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          {
            <Button
              variant="contained"
              onClick={() => {
                dispatch(removePortfolioStock(stockData.scripcode));
                dispatch(removePortfolioStocksData(stockData.scripcode));
              }}
            >
              Remove
            </Button>
          }
        </Grid>
      </Grid>
      <Divider />
</>
  );
};
