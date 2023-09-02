import { createSlice } from "@reduxjs/toolkit";

export const commentSlice = createSlice({
  initialState: true,
  name: "commentSlice",
  reducers: {
    addComment: (state, action) => {
      return (state = !state);
    },
  },
});

export const { addComment } = commentSlice.actions;
export default commentSlice.reducer;
