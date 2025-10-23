import {baseApi} from "../baseUrl";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetReviewsQuery } = reviewsApi;