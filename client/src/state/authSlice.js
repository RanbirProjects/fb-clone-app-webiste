import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  friends: [],
  friendRequests: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.friends = [];
      state.friendRequests = [];
    },
    setFriends: (state, action) => {
      state.friends = action.payload.friends;
    },
    setFriendRequests: (state, action) => {
      state.friendRequests = action.payload.friendRequests;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setLogin, setLogout, setFriends, setFriendRequests, updateUser } = authSlice.actions;
export default authSlice.reducer; 