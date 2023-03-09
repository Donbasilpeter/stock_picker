import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  navItems: ["Home", "About", "Skills", "Education", "Experience", "Contact"],
  currentNavItem: "Home",
};

const navBarSlice = createSlice({
  name: "NavBar",
  initialState,
  reducers: {
    setCurrentNavItem: (state, action) => {
      state.currentNavItem = action.payload;
    },
  },
});

export const { setCurrentNavItem } = navBarSlice.actions;
export default navBarSlice.reducer;
