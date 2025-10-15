import { baseApi } from "../baseUrl";

// {{hostUrl}}/hotels/popular?limit=4
export const hotelsApiExtended = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPopularHotels: builder.query({
      query: (limit = 4) => ({
        url: `/hotels/popular?limit=${limit}`,
        method: "GET",
      }),
      // If you later add tags for hotels, you can provide them here
    }),
  }),
  overrideExisting: false,
});

export const { useGetPopularHotelsQuery } = hotelsApiExtended;