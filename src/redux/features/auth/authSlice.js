import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload || {};
      if (accessToken !== undefined) state.accessToken = accessToken;
      if (refreshToken !== undefined) state.refreshToken = refreshToken;
      if (user !== undefined) state.user = user;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logout } = slice.actions;

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken'],
};

export const authReducer = persistReducer(persistConfig, slice.reducer);
