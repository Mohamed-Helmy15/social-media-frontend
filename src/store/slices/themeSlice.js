import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  initialState: localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : "light",
  name: "themeSlice",
  reducers: {
    toggle: (state, action) => {
      localStorage.setItem(
        "theme",
        (state = state === "light" ? "dark" : "light")
      );
      // return (state = state === "light" ? "dark" : "light");
      return (state = localStorage.getItem("theme"));
    },
  },
});

export const { toggle } = themeSlice.actions;
export default themeSlice.reducer;
