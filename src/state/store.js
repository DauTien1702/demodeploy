import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../state/searchProduct/searchSlice";
import filterReducer from "./filter/filterSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    filter: filterReducer,
  },
});
