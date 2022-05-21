import { createSlice } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

const initialState = {
  singlePost: {},
  posts: [],
  results: 0,
  loading: false,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setPost, setPosts, setLoading } = postSlice.actions;

export const selectAllPosts = (state) => state.post.posts;

export const selectTotalResult = (state) => state.post.results;

export const selectLoading = (state) => state.post.loading;

export const fetchPostsAsync =
  ({ limit, offset }) =>
  async (dispatch) => {
    const { data } = await axios.get(`/posts?limit=${limit}&offset=${offset}`);
    dispatch(setPosts(data));
  };

export const createPostAsync =
  ({ title, content, date }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    await axios.post("/posts", {
      title,
      content,
      date,
    });
    dispatch(setLoading(false));
  };


export default postSlice.reducer;
