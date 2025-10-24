import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { API_BASE_URL } from "../../../config/env";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  changePasswordStatus: "idle",
  changePasswordError: null,
};

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (updatedPass, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.accessToken;
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPass),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.message || "Failed to update user profile";
        return thunkAPI.rejectWithValue(message);
      }
      return data?.data;
    } catch (error) {
      const message = error?.message || "Failed to update user profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.message || "Failed to request password reset";
        return thunkAPI.rejectWithValue(message);
      }
      return data?.data;
    } catch (error) {
      const message = error?.message || "Failed to request password reset";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkOTP = createAsyncThunk(
  "auth/verify-otp",
  async (otp, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.message || "Invalid or expired OTP";
        return thunkAPI.rejectWithValue(message);
      }
      return data?.data;
    } catch (error) {
      const message = error?.message || "Invalid or expired OTP";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const slice = createSlice({
  name: "auth",
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
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.changePasswordStatus = "loading";
        state.changePasswordError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordStatus = "succeeded";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordStatus = "failed";
        state.changePasswordError =
          action.payload ||
          action.error?.message ||
          "Failed to update user profile";
      });
  },
});

export const { setCredentials, logout } = slice.actions;

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "refreshToken"],
};

export const authReducer = persistReducer(persistConfig, slice.reducer);
