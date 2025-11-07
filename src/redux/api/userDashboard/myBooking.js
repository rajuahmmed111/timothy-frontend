import { baseApi } from "../baseUrl";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHotelBooking: builder.query({
      query: (
        
      ) => ({
        url: `/hotel-booking/my-bookings`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    cancelHotelBooking: builder.mutation({
      query: ({ id, bookingStatus = "CANCELLED" }) => ({
        url: `/hotel-booking/cancel-my-booking/${id}`,
        method: "PATCH",
        body: { bookingStatus },
      }),
      invalidatesTags: ["user"],
    }),
    getAllSecurityBooking: builder.query({
      query: () => ({
        url: `/security-booking/my-bookings`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getAllCarBooking: builder.query({
      query: () => ({
        url: `/car-booking/my-bookings`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getAllAttractionBooking: builder.query({
      query: () => ({
        url: `/attraction-booking/my-bookings`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllHotelBookingQuery,
  useCancelHotelBookingMutation,
  useGetAllSecurityBookingQuery,
  useGetAllCarBookingQuery,
  useGetAllAttractionBookingQuery,
} = bookingApi;
