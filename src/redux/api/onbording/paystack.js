import { baseApi } from "../baseUrl";

export const paystackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    paystackAccountSubAccount: builder.mutation({
      query: (body) => ({
        url: `/payments/paystack-account-sub-account`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { usePaystackAccountSubAccountMutation } = paystackApi;
