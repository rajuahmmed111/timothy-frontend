import { baseApi } from '../baseUrl';

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCars: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, ...rest } = params;
        const filtered = Object.fromEntries(
          Object.entries({ page: String(page), limit: String(limit), ...rest })
            .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
        const search = new URLSearchParams(filtered).toString();
        return {
          url: `/car-rentals/cars${search ? `?${search}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getSingleCar: builder.query({
      query: (id) => ({
        url: `/car-rentals/car/${id}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,  
});

export const { useGetAllCarsQuery, useGetSingleCarQuery } = carApi;