import { baseApi } from "../baseUrl";

export const hotelReviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHotelReviews: builder.query({
            query: (id) => ({
                url: `/reviews/hotel/${id}`,
                method: "GET",
            }),
            providesTags: ["hotel"],
        }),
    }),
});
export const { useGetHotelReviewsQuery } = hotelReviewsApi;
