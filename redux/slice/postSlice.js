import { createSlice } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

const initialState = {
  singlePost: {},
  posts: [],
  results: 0,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.singlePost = action.payload;
    },
    setPosts: (state, action) => {

      state.posts = [...action.payload.posts];
      state.results = action.payload.results;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPost, setPosts } = postSlice.actions;

export const selectAllPosts = (state) => state.post.posts;

export const selectTotalResult = (state) => state.post.results;

export const fetchPostsAsync =
  ({ limit, offset }) =>
  async (dispatch) => {
    const { data } = await axios.get(`/posts?limit=${limit}&offset=${offset}`);
    dispatch(setPosts(data));
  };

export default postSlice.reducer;
