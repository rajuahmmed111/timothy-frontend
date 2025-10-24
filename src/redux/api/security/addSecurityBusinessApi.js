import {baseApi} from "../baseUrl";

export const securityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSecurityBusiness: builder.mutation({
      query: (businessData) => ({
        url: "/security-protocols",
        method: "POST",
        body: businessData,
      }),
      invalidatesTags: ["Security"],
    }),
  }),
});

export const { useAddSecurityBusinessMutation } = securityApi;