import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/env';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Profile'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.accessToken;
      if (token) headers.set('Authorization', `${token}`);
      return headers;
    },
  }),
  
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: '/users/my-profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
  }),
});

export const { useRegisterUserMutation, useLoginMutation, useGetMyProfileQuery } = authApi;
