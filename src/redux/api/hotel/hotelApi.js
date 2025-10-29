import { baseApi } from "../baseUrl";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHotelRooms: builder.query({
      query: (params = {}) => ({
        url: `/hotels`,
        method: "GET",
        params,
      }),
      providesTags: ["hotel"],
    }),
    getHotelDetails: builder.query({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: "GET",
      }),
      providesTags: ["hotel"],
    }),
    getHotelRooms: builder.query({
      query: ({ page, limit }) => ({
        url: `/hotels/room-active-listing`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["hotel"],
    }),
    getHotelAvailableRooms: builder.query({
      query: (params) => ({
        url: `/hotels/available-rooms`,
        method: "GET",
        params,
      }),
      providesTags: ["hotel"],
    }),
    getHotelBookings: builder.query({
      query: (params = {}) => ({
        url: `/hotel-booking`,
        method: "GET",
        params,
      }),
      providesTags: ["hotel"],
    }),
    getTotalSales: builder.query({
      query: () => ({
        url: `/statistics/partner-total-earnings-hotel`,
        method: "GET",
      }),
      providesTags: ["hotel"],
    }),
    deleteHotelRoom: builder.mutation({
      query: (id) => ({
        url: `/hotels/room/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["hotel"],
    }),
    addHotelRoom: builder.mutation({
      query: ({ formData, hotelId }) => ({
        url: `/hotels/room/${hotelId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["hotel"],
    }),
    addHotelBusiness: builder.mutation({
      query: (businessData) => ({
        url: "/hotels",
        method: "POST",
        body: businessData,
      }),
      invalidatesTags: ["hotel"],
    }),
    getHotelBusinessPartner: builder.mutation({
      query: ({ limit, page }) => ({
        url: `/hotels/partner-hotels?limit=${limit}&page=${page}`,
        method: "GET",
        prepareHeaders: (headers) => {
          headers.set("Accept", "application/json");
          return headers;
        },
      }),
      invalidatesTags: ["HotelBusinessPartner"],
    }),
    updateHotelBusiness: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hotels/${id}`,
        method: "PATCH",
        body: data,
        prepareHeaders: (headers) => {
          headers.set("Accept", "application/json");
          return headers;
        },
      }),
      invalidatesTags: ["HotelBusinessPartner"],
    }),
    getPopularHotels: builder.query({
      query: (limit = 4) => ({
        url: `/hotels/popular?limit=${limit}`,
        method: "GET",
      }),
    }),
    guestLogin: builder.mutation({
      query: (guestData) => ({
        url: "/auth/login-website",
        method: "POST",
        body: guestData,
      }),
    }),
    createHotelBooking: builder.mutation({
      query: ({ bookingId, bookingData }) => ({
        url: `/hotel-booking/${bookingId}`,
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['HotelBookings'],
    }),
  }),
});

export const {
  useGetAllHotelRoomsQuery,
  useGetHotelRoomsQuery,
  useGetHotelAvailableRoomsQuery,
  useGetHotelBookingsQuery,
  useGetTotalSalesQuery,
  useDeleteHotelRoomMutation,
  useAddHotelRoomMutation,
  useAddHotelBusinessMutation,
  useGetHotelBusinessPartnerMutation,
  useUpdateHotelBusinessMutation,
  useGetPopularHotelsQuery,
  useGetHotelDetailsQuery,
  useCreateHotelBookingMutation,
  useGuestLoginMutation,
} = hotelApi;
