import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    normalisedStocks:[],
    selectedStock:0,
    selectedStockData:{},

};

const normalisedStocksSlice = createSlice({
  name: "NormalisedStocks",
  initialState,
  reducers: {
    setNormalisedStocks: (state, action) => {
      state.normalisedStocks = action.payload;
    },
    setSelectedStock: (state, action) => {
      state.selectedStock = action.payload;
    },
    setSelectedStockData: (state, action) => {
      state.selectedStockData = action.payload;
    },
  },
});

export const { setNormalisedStocks, setSelectedStock,setSelectedStockData } =normalisedStocksSlice.actions;
export default normalisedStocksSlice.reducer;
