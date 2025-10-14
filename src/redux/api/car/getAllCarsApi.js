import { baseApi } from '../baseUrl';

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCars: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/car-rentals/cars?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,  
});

export const { useGetAllCarsQuery } = carApi;