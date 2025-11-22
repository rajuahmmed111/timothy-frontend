import { baseApi } from "../baseUrl";
//all
export const singleUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetSingleUserByIdQuery } = singleUserApi;
