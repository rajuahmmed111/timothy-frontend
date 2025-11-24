import { baseApi } from "../baseUrl";

export const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    stripeAccountOnboarding: builder.mutation({
      query: (body) => ({
        url: `/payments/stripe-account-onboarding`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useStripeAccountOnboardingMutation } = stripeApi;
