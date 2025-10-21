import { baseApi } from "../baseUrl";

export const securityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityProtocols: builder.query({
      query: (params) => ({
        url: `/security-protocols/security-guard`,
        method: "GET",
        params,
      }),
      providesTags: ["Security"],
    }),
  }),
});

export const { useGetSecurityProtocolsQuery } = securityApi;
