import { baseApi } from "../baseUrl";

export const securityApiExtended = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityProtocols: builder.query({
      query: ({ page = 1, limit = 10 }) => {
        const url = `/security-protocols?page=${page}&limit=${limit}`;
        console.log('Fetching from URL:', url);
        return {
          url,
          method: "GET",
        };
      },
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems, { arg }) => {
        console.log('Merging data:', { currentCache, newItems, arg });
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          data: [...(currentCache?.data || []), ...(newItems?.data || [])],
        };
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      transformResponse: (response) => {
        console.log('Raw API response:', response);
        
        if (!response) {
          console.error('No response received from API');
          return { data: [], meta: {} };
        }
        
        if (!response.data) {
          console.error('No data in response:', response);
          return { data: [], meta: response.meta || {} };
        }
        
        const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
        
        return {
          data: items.map(provider => ({
            id: provider.id,
            name: provider.securityName || provider.securityBusinessName || 'Unnamed Provider',
            location: provider.user?.fullName || 'Location not specified',
            image: provider.businessLogo || "/placeholder-security.png",
            price: provider.securityBookingCondition || "Price on request",
            rating: 5,
            type: provider.securityBusinessType || 'General',
            description: provider.securityTagline || '',
            fullData: provider
          })),
          meta: response.meta || {}
        };
      },
      transformErrorResponse: (response,) => {
        console.error('API Error:', response);
        return response;
      },
    }),
    
  }),
  overrideExisting: false,
});

export const { useGetSecurityProtocolsQuery } = securityApiExtended;