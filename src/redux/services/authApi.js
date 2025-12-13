import { baseApi } from "../api/baseUrl";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
    }),
    partner: builder.mutation({
      query: (body) => ({
        url: "/users/partner",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    loginWebsite: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login-website",
        method: "POST",
        body: credentials,
      }),
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: "/users/my-profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    verifyUser: builder.mutation({
      query: (data) => ({
        url: "/users/verify-user",
        method: "POST",
        body: data,
      }),
    }),
    verifyPartner: builder.mutation({
      query: (data) => ({
        url: "/users/verify-partner",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  usePartnerMutation,
  useLoginMutation,
  useLoginWebsiteMutation,
  useGetMyProfileQuery,
  useVerifyUserMutation,
  useVerifyPartnerMutation,
} = authApi;
