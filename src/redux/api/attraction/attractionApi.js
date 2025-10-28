import { baseApi } from "../baseUrl";

export const attractionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttractionBusiness: builder.query({
      query: (limit = 4) => `attractions/appeals?page=1&limit=${limit}`,
      providesTags: ["AttractionBusiness"],
    }),
    getAllAttractions: builder.query({
      query: () => `attractions`,
      providesTags: ["AttractionBusiness"],
    }),
    getAttractionAppeals: builder.query({
      query: ({ searchTerm = "", page = 1, limit = 10 } = {}) =>
        `attractions/appeals?searchTerm=${encodeURIComponent(
          searchTerm
        )}&page=${page}&limit=${limit}`,
      providesTags: ["AttractionBusiness"],
    }),
    getAttractionAppealById: builder.query({
      query: (id) => `attractions/appeal/${id}`,
      providesTags: ["AttractionBusiness"],
    }),
    createAttractionBooking: builder.mutation({
      query: ({ id, body }) => ({
        url: `attraction-booking/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AttractionBusiness"],
    }),
    createPaystackCheckoutSession: builder.mutation({
      query: ({ bookingId, body }) => ({
        url: `payments/create-checkout-session-paystack/attraction/${bookingId}`,
        method: "POST",
        body,
      }),
    }),
    createStripeCheckoutSessionWebsite: builder.mutation({
      query: ({ bookingId, body }) => ({
        url: `payments/create-stripe-checkout-session-website/attraction/${bookingId}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAttractionBusinessQuery,
  useGetAllAttractionsQuery,
  useGetAttractionAppealsQuery,
  useGetAttractionAppealByIdQuery,
  useCreateAttractionBookingMutation,
  useCreatePaystackCheckoutSessionMutation,
  useCreateStripeCheckoutSessionWebsiteMutation,
} = attractionApi;
