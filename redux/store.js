import { configureStore } from "@reduxjs/toolkit";
import PostReducer from './slice/postSlice'

export default configureStore({
    reducer: {
        post: PostReducer,
    },
});

