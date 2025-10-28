import { baseApi } from "../baseUrl";

export const securiBookingtyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityBooking: builder.query({
      query: (params) => ({
        url: `/security-booking`,
        method: "GET",
        params,
      }),
      providesTags: ["SecurityBooking"],
    }),
    createSecurityBooking: builder.mutation({
      query: ({ id, body }) => ({
        url: `/security-booking/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SecurityBooking"],
    }),
    createSecurityStripeCheckoutSession: builder.mutation({
      query: (bookingId) => ({
        url: `/payments/create-stripe-checkout-session-website/security/${bookingId}`,
        method: "POST",
        body: {},
      }),
    }),
    createSecurityPaystackCheckoutSession: builder.mutation({
      query: (bookingId) => ({
        url: `/payments/create-checkout-session-paystack/security/${bookingId}`,
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const { 
  useGetSecurityBookingQuery, 
  useCreateSecurityBookingMutation, 
  useCreateSecurityStripeCheckoutSessionMutation,
  useCreateSecurityPaystackCheckoutSessionMutation 
} = securiBookingtyApi;
