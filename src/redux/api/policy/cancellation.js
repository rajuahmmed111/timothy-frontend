import { baseApi } from "../baseUrl";

export const cancellationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHumanRightsCancellationPolicy: builder.query({
      query: () => `/policy/human-rights-cancellation`,
      method: "GET",
    }),
    getHumanRightsPolicy: builder.query({
      query: () => `/human-rights`,
      method: "GET",
    }),
  }),
});

export const {
  useGetHumanRightsCancellationPolicyQuery,
  useGetHumanRightsPolicyQuery,
} = cancellationApi;
