import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/env";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.accessToken;
      if (token) headers.set("Authorization", `${token}`);
      return headers;
    },
  }),
  endpoints: () => ({}),

  tagTypes: [
    "Security",
    "SecurityBooking",
    "hotel",
    "HotelRoom",
    "security",
    "car",
    "voucher",
    "payment",
    "User",
    "Con",
  ],
});
