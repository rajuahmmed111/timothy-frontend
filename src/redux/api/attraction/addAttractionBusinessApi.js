import {baseApi} from "../baseUrl";

export const attractionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addAttractionBusiness: builder.mutation({
      query: (businessData) => ({
        url: "/attractions",
        method: "POST",
        body: businessData,
      }),
      invalidatesTags: ["AttractionBusiness"],
    }),
  }),
});

export const { useAddAttractionBusinessMutation } = attractionApi;