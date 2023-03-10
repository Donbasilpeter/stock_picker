import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  navItems: ["Home","Market-Viewer","P-Generator", "About","Contact"],
  currentNavItem: "Market-Viewer",
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
