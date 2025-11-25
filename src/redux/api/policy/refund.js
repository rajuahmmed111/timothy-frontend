import { baseApi } from "../baseUrl";

export const refundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRefundPolicies: builder.query({
      query: () => `/refund-policies`,
      method: "GET",
    }),
  }),
});

export const { useGetRefundPoliciesQuery } = refundApi;
