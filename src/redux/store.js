import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './features/auth/authSlice';
import { authApi } from './services/authApi';
import { carApi } from './api/car/getAllCarsApi';

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [carApi.reducerPath]: carApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'carApi'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([authApi.middleware, carApi.middleware]),
});

export const persistor = persistStore(store);
