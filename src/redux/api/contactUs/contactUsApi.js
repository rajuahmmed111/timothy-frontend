import { baseApi } from "../baseUrl";

export const contactUsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        contactUs: builder.mutation({
            query: (body) => ({
                url: `/settings/customer-contact`,
                method: "POST",
                body,
            }),
            
        }),
    }),
})

export const { useContactUsMutation } = contactUsApi