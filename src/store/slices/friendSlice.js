import { createSlice } from "@reduxjs/toolkit";

export const friendSlice = createSlice({
  initialState: true,
  name: "friendSlice",
  reducers: {
    renderFriends: (state, action) => {
      return (state = !state);
    },
  },
});

export const { renderFriends } = friendSlice.actions;
export default friendSlice.reducer;
