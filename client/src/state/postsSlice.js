import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    likePost: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
          post.likes = post.likes.filter((id) => id !== userId);
        } else {
          post.likes.push(userId);
        }
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
  },
});

export const { setPosts, likePost, addComment } = postsSlice.actions;

export default postsSlice.reducer; 