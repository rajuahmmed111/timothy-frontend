import { baseApi } from "../baseUrl";

export const voucherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVoucher: builder.query({
      query: ({ page, limit } = {}) => ({
        url: `/promo-codes`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["voucher"],
    }),
  }),
});

export const { useGetAllVoucherQuery } = voucherApi;
