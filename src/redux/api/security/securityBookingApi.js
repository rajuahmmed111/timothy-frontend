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
    createSecurityBooking: builder.mutation({
      query: ({ id, body }) => ({
        url: `/security-booking/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SecurityBooking"],
    }),
  }),
});

export const { useGetSecurityBookingQuery, useCreateSecurityBookingMutation } = securiBookingtyApi;
