import { baseApi } from "../baseUrl";

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCars: builder.query({
      query: (params = {}) => ({
        url: `/car-rentals/cars`,
        method: "GET",
        params,
      }),
    }),
    getSingleCar: builder.query({
      query: (id) => ({
        url: `/car-rentals/car/${id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllCarsQuery, useGetSingleCarQuery } = carApi;
