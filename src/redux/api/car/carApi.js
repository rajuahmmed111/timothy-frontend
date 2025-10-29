import { baseApi } from "../baseUrl";

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCar: builder.query({
      query: ({ page, limit }) => ({
        url: `/car-rentals/car-active-listing`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["car"],
    }),
    getAvailableCar: builder.query({
      query: (params) => ({
        url: `/car-rentals/car-available`,
        method: "GET",
        params,
      }),
      providesTags: ["car"],
    }),
    getCarBookings: builder.query({
      query: (params = {}) => ({
        url: `/car-booking`,
        method: "GET",
        params,
      }),
      providesTags: ["car"],
    }),
    getCarTotalSales: builder.query({
      query: () => ({
        url: `/statistics/partner-total-earnings-car`,
        method: "GET",
      }),
      providesTags: ["car"],
    }),
    deleteCar: builder.mutation({
      query: (id) => ({
        url: `/car-rentals/car/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["car"],
    }),
    addSecurityGuard: builder.mutation({
      query: ({ formData, Id }) => ({
        url: `/car-rentals/car/${Id}`,
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
    getCarPartner: builder.mutation({
      query: ({ page, limit }) => ({
        url: `/car-rentals`,
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
    createCarStripeSession: builder.mutation({
      query: (bookingId) => ({
        url: `/payments/create-stripe-checkout-session-website/car/${bookingId}`,
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
  useGetCarBookingsQuery,
  useGetAllCarQuery,
  useDeleteCarMutation,
  useAddSecurityGuardMutation,
  useGetAvailableCarQuery,
  useGetCarPartnerMutation,
  useUpdateSecurityBusinessMutation,
  useAddSecurityBusinessMutation,
  useCreateCarBookingMutation,
  useGetCarBookingByIdQuery,
  useLazyGetCarBookingByIdQuery,
  useLoginWebsiteMutation,
  useCreateCarPaystackSessionMutation,
  useCreateCarStripeSessionMutation,
} = carApi;
