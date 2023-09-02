import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./slices/themeSlice";
import commentSlice from "./slices/commentSlice";
import friendSlice from "./slices/friendSlice";
import profileSlice from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    comment: commentSlice,
    theme: themeSlice,
    friend: friendSlice,
    profile: profileSlice,
  },
});
