import {baseApi} from "../baseUrl";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotelBusinessPartner: builder.mutation({
      query: ({ limit, page }) => ({
        url: `/hotels/partner-hotels?limit=${limit}&page=${page}`,
        method: "GET",
        prepareHeaders: (headers) => {
          headers.set('Accept', 'application/json');
          return headers;
        },
      }),
      invalidatesTags: ["HotelBusinessPartner"],
    }),
  }),
});

export const { useGetHotelBusinessPartnerMutation } = hotelApi;