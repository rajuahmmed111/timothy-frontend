import {baseApi} from "../baseUrl";

export const attractionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAttractionBusiness: builder.query({
            query: (limit = 4) => `attractions?limit=${limit}`,
            providesTags: ["AttractionBusiness"],
        }),
        getAllAttractions: builder.query({
            query: () => `attractions`,
            providesTags: ["AttractionBusiness"],
        }),
        getAttractionAppeals: builder.query({
            query: ({ searchTerm = "", page = 1, limit = 10 } = {}) =>
                `attractions/appeals?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`,
            providesTags: ["AttractionBusiness"],
        }),
        getAttractionAppealById: builder.query({
            query: (id) => `attractions/appeal/${id}`,
            providesTags: ["AttractionBusiness"],
        }),
    }),
}); 

export const { useGetAttractionBusinessQuery, useGetAllAttractionsQuery, useGetAttractionAppealsQuery, useGetAttractionAppealByIdQuery } = attractionApi;
