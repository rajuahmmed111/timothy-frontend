import { baseApi } from "../baseUrl";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    cancelStripeBooking: builder.mutation({
      query: ({ service, bookingId }) => ({
        url: `/payments/stripe-cancel-booking/${service}/${bookingId}`,
        method: "POST",
      }),
      invalidatesTags: ["payment"],
    }),
    cancelPaystackBooking: builder.mutation({
      query: ({ service, bookingId }) => ({
        url: `/payments/paystack-cancel-booking/${service}/${bookingId}`,
        method: "POST",
      }),
      invalidatesTags: ["payment"],
    }),
    
  }),
});

export const { useCancelStripeBookingMutation, useCancelPaystackBookingMutation } = paymentApi;

