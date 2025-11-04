import { baseApi } from "../baseUrl";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHotelBooking: builder.query({
      query: () => ({
        url: `/hotel-booking/my-bookings`,
        method: "GET",
      }),
      providesTags: ["user"],
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
  useGetAllSecurityBookingQuery,
  useGetAllCarBookingQuery,
  useGetAllAttractionBookingQuery,
} = bookingApi;
