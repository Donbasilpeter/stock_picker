import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "../reducers/navbar";

export const store = configureStore({
  reducer: combineReducers({
    navbar: navbarReducer,
  }),
});
