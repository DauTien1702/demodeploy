import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brand: "",
  category: "",
  product: "",
  user: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // Brand
    setBrandSelected(state, action) {
      state.brand = action.payload;
    },
    clearBrandSelected(state) {
      state.brand = "";
    },

    // Product
    setProductSelected(state, action) {
      state.product = action.payload;
    },
    clearProductSelected(state) {
      state.product = "";
    },

    // Category
    setCategorySelected(state, action) {
      state.category = action.payload;
    },
    clearCategorySelected(state) {
      state.category = "";
    },

    // User
    setUserSelected(state, action) {
      state.user = action.payload;
    },
    clearUserSelected(state) {
      state.user = "";
    },
  },
});

export const {
  setBrandSelected,
  setProductSelected,
  setCategorySelected,
  setUserSelected,
  clearProductSelected,
  clearCategorySelected,
  clearUserSelected,
  clearBrandSelected,
} = filterSlice.actions;

export default filterSlice.reducer;
