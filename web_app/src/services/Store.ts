import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "../reducers/navbar";
import normalisedStockReducer from "../reducers/normalisedStock";

export const store = configureStore({
  reducer: combineReducers({
    navbar: navbarReducer,
    normalisedStock : normalisedStockReducer
  }),
});
