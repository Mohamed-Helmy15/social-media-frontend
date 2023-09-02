import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  initialState: true,
  name: "profileSlice",
  reducers: {
    renderProfile: (state, action) => {
      return (state = !state);
    },
  },
});

export const { renderProfile } = profileSlice.actions;
export default profileSlice.reducer;
