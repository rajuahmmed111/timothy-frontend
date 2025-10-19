import {baseApi} from "../baseUrl";

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCarBusiness: builder.mutation({
      query: (businessData) => ({
        url: "/car-rentals",
        method: "POST",
        body: businessData,
      }),
      invalidatesTags: ["CarBusiness"],
    }),
  }),
});

export const { useAddCarBusinessMutation } = carApi;