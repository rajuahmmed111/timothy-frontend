import { baseApi } from "../baseUrl";

export const securityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSecurity: builder.query({
      query: ({ page, limit }) => ({
        url: `/security-protocols/security-guards-active-listing`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["security"],
    }),
    getAvailableSecurity: builder.query({
      query: (params) => ({
        url: `/security-protocols/security-guards-available`,
        method: "GET",
        params,
      }),
      providesTags: ["security"],
    }),
    getSecurityBookings: builder.query({
      query: (params = {}) => ({
        url: `/security-booking`,
        method: "GET",
        params,
      }),
      providesTags: ["security"],
    }),
    getSecurityTotalSales: builder.query({
      query: () => ({
        url: `/statistics/partner-total-earnings-security`,
        method: "GET",
      }),
      providesTags: ["security"],
    }),
    getAllSecurityProtocols: builder.query({
      query: (params = {}) => ({
        url: `/security-protocols`,
        method: "GET",
        params,
      }),
      providesTags: ["security"],
    }),
    getSecurityGuardByPartnerId: builder.query({
      query: (id) => ({
        url: `/security-protocols/security-guard/${id}`,
        method: "GET",
      }),
      providesTags: ["security"],
    }),
    getSecurityProtocolById: builder.query({
      query: (id) => ({
        url: `/security-protocols/${id}`,
        method: "GET",
      }),
      providesTags: ["security"],
    }),
    deleteSecurityGuard: builder.mutation({
      query: (id) => ({
        url: `/security-protocols/security-guard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["security"],
    }),
    addSecurityGuard: builder.mutation({
      query: ({ formData, Id }) => ({
        url: `/security-protocols/security-guard-type/${Id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["security"],
    }),
    addSecurityBusiness: builder.mutation({
      query: (businessData) => ({
        url: "/security-protocols",
        method: "POST",
        body: businessData,
      }),
      invalidatesTags: ["security"],
    }),
    getSecurityPartner: builder.mutation({
      query: ({ page, limit }) => ({
        url: `/security-protocols/partner`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      invalidatesTags: ["security"],
    }),
    updateSecurityBusiness: builder.mutation({
      query: ({ id, data }) => ({
        url: `/security-protocols/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["security"],
    }),
    getAllSecurityProtocolsWithGuards: builder.query({
      query: ({ page = 1, limit = 10, ...filters } = {}) => ({
        url: '/security-protocols/security-guard',
        method: 'GET',
        params: {
          page,
          limit,
          ...filters
        },
      }),
      providesTags: ['security'],
    }),
  }),
});

export const {
  useGetSecurityTotalSalesQuery,
  useGetSecurityBookingsQuery,
  useGetAllSecurityQuery,
  useGetAllSecurityProtocolsQuery,
  useGetSecurityProtocolByIdQuery,
  useGetSecurityGuardByPartnerIdQuery,
  useDeleteSecurityGuardMutation,
  useAddSecurityGuardMutation,
  useGetAvailableSecurityQuery,
  useGetSecurityPartnerMutation,
  useUpdateSecurityBusinessMutation,
  useAddSecurityBusinessMutation,
  useGetAllSecurityProtocolsWithGuardsQuery,
} = securityApi;
