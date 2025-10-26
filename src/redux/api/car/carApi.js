import { baseApi } from "../baseUrl";

export const carApi = baseApi.injectEndpoints({
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
    getCarTotalSales: builder.query({
      query: () => ({
        url: `/statistics/partner-total-earnings-car`,
        method: "GET",
      }),
      providesTags: ["car"],
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
    createCarBooking: builder.mutation({
      query: ({ carId, data }) => ({
        url: `/car-booking/${carId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["car"],
    }),
    createCarPaystackSession: builder.mutation({
      query: (bookingId) => ({
        url: `/payments/create-checkout-session-paystack/car/${bookingId}`,
        method: "POST",
      }),
    }),
    getCarBookingById: builder.query({
      query: (id) => ({
        url: `/car-booking/${id}`,
        method: "GET",
      }),
      providesTags: ["car"],
    }),
    loginWebsite: builder.mutation({
      query: (credentials) => ({
        url: `/auth/login-website`,
        method: "POST",
        body: credentials,
      }),
    }),

    
  }),
});

export const {
  useGetCarTotalSalesQuery,
  useGetSecurityBookingsQuery,
  useGetAllSecurityQuery,
  useDeleteSecurityGuardMutation,
  useAddSecurityGuardMutation,
  useGetAvailableSecurityQuery,
  useGetSecurityPartnerMutation,
  useUpdateSecurityBusinessMutation,
  useAddSecurityBusinessMutation,
  useCreateCarBookingMutation,
  useGetCarBookingByIdQuery,
  useLazyGetCarBookingByIdQuery,
  useLoginWebsiteMutation,
  useCreateCarPaystackSessionMutation,
} = carApi;
