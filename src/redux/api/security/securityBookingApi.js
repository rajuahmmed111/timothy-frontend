import { baseApi } from "../baseUrl";

export const securiBookingtyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityBooking: builder.query({
      query: (params) => ({
        url: `/security-booking`,
        method: "GET",
        params,
      }),
      providesTags: ["SecurityBooking"],
    }),
  }),
});

export const { useGetSecurityBookingQuery } = securiBookingtyApi;
