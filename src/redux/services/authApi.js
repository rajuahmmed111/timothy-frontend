import { baseApi } from '../api/baseUrl';

export const authApi = baseApi.injectEndpoints({
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
    loginWebsite: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login-website',
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

export const { useRegisterUserMutation, useLoginMutation, useLoginWebsiteMutation, useGetMyProfileQuery } = authApi;
