import {baseApi} from "../baseUrl";

export const attractionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAttractionBusiness: builder.query({
            query: (limit = 4) => `attractions?limit=${limit}`,
            providesTags: ["AttractionBusiness"],
        }),
    }),
}); 

export const { useGetAttractionBusinessQuery } = attractionApi;
