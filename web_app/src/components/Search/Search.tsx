import React, { useState } from "react";
import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  Box,
  Divider,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import "./search.scss";
import { useNavigate } from "react-router-dom";
import { SearchProps } from "../../interfaces/props";
import { addPortfolioStock, removePortfolioStock, removePortfolioStocksData } from "../../reducers/portfolio";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../interfaces/store";

const Search = ({
  setSearchField,
  dropDownArray,
  setSearchColumn,
  dropDownValues,
}: SearchProps) => {
  const [dropDown, setDropDown] = useState(false);
  const onFocus = () => setDropDown(true);
  const onBlur = () =>setTimeout(() => {
    setDropDown(false)
  }, 1000);
  const [searchvalue, setSearchValue] = useState("");
  const portfolioStocks = useSelector(
    (state: State) => state.portfolio.portfolioStocks
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();


  return (
    <>
      <div className="search-parent">
        <div className="search-child-1">
          <FormControl
            fullWidth
            sx={{ m: 1, backgroundColor: "white" }}
            variant="outlined"
          >
            <OutlinedInput
              id="standard-adornment-amount"
              placeholder="Search"
              type="text"
              autoComplete="off"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchField(e.target.value);
                setSearchValue(e.target.value);
              }}
              value={searchvalue}
              onFocus={onFocus}
              onBlur={onBlur}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                <div>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "fit-content",
                      bgcolor: "background.paper",
                      color: "text.secondary",
                      "& hr": {
                        mx: 0.5,
                      },
                    }}
                  >
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 70 }}>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Age"
                        disableUnderline
                        defaultValue={dropDownArray[0]}
                        IconComponent={KeyboardArrowDownIcon}
                        onChange={(e) => {
                          setSearchColumn(e.target.value);
                          setSearchField("");
                          setSearchValue("");
                        }}
                      >
                        {dropDownArray &&
                          dropDownArray.map((dropDownValue) => (
                            <MenuItem key={dropDownValue} value={dropDownValue}>
                              <Typography variant="body2">
                                {dropDownValue}
                              </Typography>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              }
            />
          </FormControl>
        </div>
        <div style={{ display: dropDown ? "flex" : "none" }}>
          <div className="search-drop-down">
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="caption"
                  sx={{ paddingBottom: 10, fontSize: 8 }}
                >
                  search results
                </Typography>
                {dropDownValues?.map((eachValue: any) => (
                  <Box key={eachValue.scripcode} sx={{ mt: 2 }}>
                       <Grid container sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                      <Typography
                      variant="body1"
                      sx={{ textDecoration: "underline", cursor: "pointer" }}
                      color="primary"
                      onClick={() => {
                        navigate("/stock-analysis/" + eachValue.scripcode);
                      }}
                    >
                      {eachValue.Scripname}
                    </Typography>
                      </Grid>
                      <Grid item xs={3}>
                      {!portfolioStocks.includes(eachValue.scripcode) ? (
              <Button
                variant="outlined"
                onClick={() => {
                  dispatch(addPortfolioStock(eachValue.scripcode));
                }}
              >
                Add
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  dispatch(
                    removePortfolioStocksData(eachValue.scripcode)
                  );
                  dispatch(removePortfolioStock(eachValue.scripcode));
                }}
              >
                Remove
              </Button>
            )}
                      </Grid>
                      </Grid>

            

                    <Typography variant="caption" sx={{ fontSize: 8 }}>
                      {eachValue.scripcode}
                    </Typography>
                    <Grid container sx={{ mb: 1 }}>
                      <Grid item xs={3}>
                        <Typography variant="body2"> CAGR :</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="secondary">
                          {Math.round((eachValue.cagr + Number.EPSILON) * 100) /
                            100}
                          %
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2"> SD :</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="secondary">
                          {Math.round(
                            (eachValue.dailyStandardDeviation +
                              Number.EPSILON) *
                              100
                          ) / 100}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                  </Box>
                ))}
              </CardContent>
              <Divider />

              {/* <div className="advanced-search" onClick={()=>{navigate('/private/advancedSearch')}}>
        <SearchIcon sx={{ fontSize: "18px"}}/>   
          <Typography variant="body2" sx={{pl:1}}>
          Advanced Search
     </Typography>
      </div> */}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
