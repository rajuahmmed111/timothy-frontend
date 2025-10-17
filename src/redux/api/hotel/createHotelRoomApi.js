import {baseApi} from "../baseUrl";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addHotelRoom: builder.mutation({
      query: ({ formData, hotelId }) => ({
        url: `/hotels/room/${hotelId}`,
        method: "POST",
        body: formData,
        // Important: Don't set Content-Type header for FormData, let the browser set it with the correct boundary
        prepareHeaders: (headers) => {
          headers.set('Accept', 'application/json');
          return headers;
        },
      }),
      invalidatesTags: ["HotelRoom"],
    }),
  }),
});

export const { useAddHotelRoomMutation } = hotelApi;