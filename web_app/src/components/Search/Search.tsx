import React, { useState, useRef, useEffect } from "react";
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
import { searchStockList } from "../../services/apis";
import { setSearchResult } from "../../reducers/portfolio";
import { IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";


const Search = () => {
  const [searchField, setSearchField] = useState("");
  const [searchColumn, setSearchColumn] = useState("Name");
  const dropDownArray = ["Name", "CAGR", "SD"]
  const [page, setPage] = useState(1); // Track the current page number
  const searchResult = useSelector((state: State) => state.portfolio.searchResult);

  const prevSearchField = useRef(searchField);

  useEffect(() => {
    if (searchField !== prevSearchField.current) {
      // Reset page to 1 when searchField has changed
      setPage(1);
      prevSearchField.current = searchField; // Update the reference to the new searchField
    }
  
    if (searchField) {
      searchStockList(searchColumn, searchField, page) // Use the current page value
        .then((data) => {
          if (data.status === "success") {
            dispatch(setSearchResult(data.data));
          }
        });
    } else {
      dispatch(setSearchResult([]));
    }
  }, [searchField, page]);

  const [dropDown, setDropDown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const portfolioStocks = useSelector(
    (state: State) => state.portfolio.portfolioStocks
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onFocus = () => setDropDown(true);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePagination = (newPage: number) => {
    setPage(newPage); // Update the page number
  };

  return (
    <>
      <div className="search-parent" ref={dropdownRef}>
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
              value={searchValue}
              onFocus={onFocus}
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
        {dropDown && searchResult.length!=0 && (
          <div className="search-drop-down">
            <Card sx={{ mb: 2 }}>
              <CardContent>
                {searchResult?.map((eachValue: any) => (
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
                              dispatch(removePortfolioStocksData(eachValue.scripcode));
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

                {/* Pagination Controls */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <IconButton
                    onClick={() => handlePagination(page - 1)}
                    disabled={page <= 1}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ display: "inline", margin:"auto" }}>
         {page}
      </Typography>
                 <IconButton
                    onClick={() => handlePagination(page + 1)}
                    disabled={searchResult.length!=10}

                  >
                    <NavigateNextIcon />
                  </IconButton>

                </Box>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </>
  );
};

export default Search;
