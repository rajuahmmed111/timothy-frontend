import { baseApi } from "../baseUrl";

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCars: builder.query({
      query: () => ({
        url: `/car-rentals/cars`,
        method: "GET",
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
