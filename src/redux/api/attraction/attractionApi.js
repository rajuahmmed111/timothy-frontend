import { baseApi } from "../baseUrl";

export const attractionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttractionBusiness: builder.query({
      query: (limit = 4) => `attractions/appeals?page=1&limit=${limit}`,
      providesTags: ["attraction"],
    }),
    getAllAttractions: builder.query({
      query: () => `attractions`,
      providesTags: ["attraction"],
    }),
    getAttractionAppeals: builder.query({
      query: ({ searchTerm = "", page = 1, limit = 10 } = {}) =>
        `attractions/appeals?searchTerm=${encodeURIComponent(
          searchTerm
        )}&page=${page}&limit=${limit}`,
      providesTags: ["attraction"],
    }),
    getAttractionAppealById: builder.query({
      query: (id) => `attractions/appeal/${id}`,
      providesTags: ["attraction"],
    }),
    createAttractionBooking: builder.mutation({
      query: ({ id, body }) => ({
        url: `attraction-booking/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["attraction"],
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
    getAttractionTotalSales: builder.query({
      query: () => ({
        url: `/statistics/partner-total-earnings-attraction`,
        method: "GET",
      }),
      providesTags: ["attraction"],
    }),
    getAttractionBookings: builder.query({
      query: (params = {}) => ({
        url: `/attraction-booking`,
        method: "GET",
        params,
      }),
      providesTags: ["attraction"],
    }),
    getAllActiveAttractionListings: builder.query({
      query: ({ page, limit }) => ({
        url: `/attractions/appeals-active-listing`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["attraction"],
    }),
    getAttractionAvailableListings: builder.query({
      query: ({ page, limit }) => ({
        url: `/attractions/appeals-available`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["attraction"],
    }),
    createAttractionAppeal: builder.mutation({
      query: ({ attractionBusinessId, data }) => ({
        url: `/attractions/appeal/${attractionBusinessId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["attraction"],
    }),
    addAttractionBusiness: builder.mutation({
      query: (businessData) => ({
        url: "/attractions",
        method: "POST",
        body: businessData,
      }),
      invalidatesTags: ["attraction"],
    }),
    getAllAttractionBusiness: builder.query({
      query: (limit = 10) => `attractions?page=1&limit=${limit}`,
      providesTags: ["attraction"],
    }),
    getPartenrsAllAttraction: builder.query({
      query: () => `/attractions/partner`,
      providesTags: ["attraction"],
    }),
    updateAttractionBusiness: builder.mutation({
      query: ({ id, data }) => ({
        url: `/attractions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["attraction"],
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
  useGetAttractionTotalSalesQuery,
  useGetAttractionBookingsQuery,
  useGetAllActiveAttractionListingsQuery,
  useGetAttractionAvailableListingsQuery,

  useCreateAttractionAppealMutation,
  useGetPartenrsAllAttractionQuery,
  
  useAddAttractionBusinessMutation,
  useGetAllAttractionBusinessQuery,
  useUpdateAttractionBusinessMutation,
} = attractionApi;
