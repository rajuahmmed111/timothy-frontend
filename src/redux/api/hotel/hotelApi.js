import { baseApi } from "../baseUrl";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotelRooms: builder.query({
      query: (params) => ({
        url: `/hotels/rooms`,
        method: "GET",
        params,
      }),
      providesTags: ["hotel"],
    }),
    getHotelAvailableRooms: builder.query({
      query: ({ limit = 10, page = 1, isBooked } = {}) => ({
        url: `/hotels/rooms`,
        method: "GET",
        params: {
          limit,
          page,
          ...(isBooked ? { isBooked } : {}),
        },
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
    
  }),
});

export const {
  useGetHotelRoomsQuery,
  useGetHotelAvailableRoomsQuery,
  useGetHotelBookingsQuery,
  useDeleteHotelRoomMutation,
  useAddHotelRoomMutation,
  useAddHotelBusinessMutation,
} = hotelApi;
