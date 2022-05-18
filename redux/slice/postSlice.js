import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    post: {},
    posts: [],
    totalPost: 0,
  },
  reducers: {
    setPost: (state, action) => {
      state.post = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.totalPost = action.payload.totalCount;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPost, setPosts } = postSlice.actions;


export default postSlice.reducer;
