import { createSlice } from "@reduxjs/toolkit";
import { PortfolioReducer } from "../interfaces/store";
const initialState: PortfolioReducer = {
  portfolioStocks: [],
  portfolioStocksData: [],
  portfolio: {
    Data: [],
    arrayOfDailyChange: [],
    dailyMean: 0,
    dailyStandardDeviation: 0,
    cagr: 0,
    stocks: [],
  },
  searchResult: [],
};

const portfolioSlice = createSlice({
  name: "Portfolio",
  initialState,
  reducers: {
    addPortfolioStock: (state, action) => {
      if (!state.portfolioStocks.includes(action.payload)) {
        state.portfolioStocks.push(action.payload);
      }
    },
    removePortfolioStock: (state, action) => {
      const index = state.portfolioStocks.indexOf(action.payload);
      if (index > -1) {
        state.portfolioStocks.splice(index, 1);
      }
    },
    addPortfolioStocksData: (state, action) => {
      if (
        state.portfolioStocksData.filter(
          (element) => element.scripcode === action.payload.scripcode
        ).length <= 0
      ) {
        state.portfolioStocksData.push(action.payload);
      }
    },
    removePortfolioStocksData: (state, action) => {
      const index = state.portfolioStocksData.findIndex(
        (x) => x.scripcode === action.payload
      );
      if (index > -1) {
        state.portfolioStocksData.splice(index, 1);
      }
    },
    setPortfolio: (state, action) => {
      state.portfolio = action.payload;
    },
    setSearchResult: (state, action) => {
      state.searchResult = action.payload;
    },
  },
});

export const {
  addPortfolioStock,
  removePortfolioStock,
  addPortfolioStocksData,
  removePortfolioStocksData,
  setPortfolio,
  setSearchResult,
} = portfolioSlice.actions;
export default portfolioSlice.reducer;
