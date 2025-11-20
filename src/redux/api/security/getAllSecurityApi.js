import { baseApi } from "../baseUrl";
//all
export const securityProtocolsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityProtocols: builder.query({
      query: (params = {}) => ({
        url: `/security-protocols/security-guard`,
        method: "GET",
        params,
      }),
      providesTags: ["Security"],
    }),
    getSecurityProtocolsRoot: builder.query({
      query: (params = {}) => ({
        url: `/security-protocols`,
        method: "GET",
        params,
      }),
      providesTags: ["Security"],
    }),
    getSecurityProtocolById: builder.query({
      query: (id) => ({
        url: `/security-protocols/${id}`,
        method: "GET",
      }),
      providesTags: ["Security"],
    }),
    //single
    getSecurityGuardById: builder.query({
      query: (id) => ({
        url: `/security-protocols/security-guard/${id}`,
        method: "GET",
      }),
      providesTags: ["Security"],
    }),
  }),
});


export const {
  useGetSecurityProtocolsQuery,
  useGetSecurityProtocolsRootQuery,
  useGetSecurityGuardByIdQuery,
  useGetSecurityProtocolByIdQuery,
} = securityProtocolsApi;
