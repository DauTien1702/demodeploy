import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchTerm: "",
    searchResults: [],
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload; //Update state of searchTerm, payload(data of user input)
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
  },
});

export const { setSearchResults, setSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;

// initialState: initial value
// reducers: set data of user input into initialState
