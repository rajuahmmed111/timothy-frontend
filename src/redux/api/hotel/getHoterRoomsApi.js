import { baseApi } from "../baseUrl";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotelRooms: builder.query({
      query: ({ limit = 10, page = 1 } = {}) => ({
        url: `/hotels/rooms`,
        method: "GET",
        params: {
          limit,
          page
        },
        prepareHeaders: (headers) => {
          headers.set('Accept', 'application/json');
          return headers;
        },
      }),
      providesTags: ['HotelRooms'],
    }),
  }),
});

export const { useGetHotelRoomsQuery } = hotelApi;