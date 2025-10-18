import { baseApi } from "../baseUrl";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateHotelBusiness: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hotels/${id}`,
        method: "PATCH",
        body: data,
        prepareHeaders: (headers) => {
          headers.set('Accept', 'application/json');
          return headers;
        },
      }),
      invalidatesTags: ["HotelBusinessPartner"],
    }),
  }),
});

export const { useUpdateHotelBusinessMutation } = hotelApi;