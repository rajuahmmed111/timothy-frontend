import {baseApi} from "../baseUrl";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addHotelBusiness: builder.mutation({
      query: (businessData) => ({
        url: "/hotels",
        method: "POST",
        body: businessData,
      }),
      invalidatesTags: ["HotelBusiness"],
    }),
  }),
});

export const { useAddHotelBusinessMutation } = hotelApi;