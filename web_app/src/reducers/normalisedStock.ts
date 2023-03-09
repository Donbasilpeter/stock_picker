import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    normalisedStocks:[]
};

const normalisedStocksSlice = createSlice({
  name: "NormalisedStocks",
  initialState,
  reducers: {
    setNormalisedStocks: (state, action) => {
      state.normalisedStocks = action.payload;
    },
  },
});

export const { setNormalisedStocks } =normalisedStocksSlice.actions;
export default normalisedStocksSlice.reducer;
