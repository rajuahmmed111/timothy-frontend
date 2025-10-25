import React from "react";
import SecurityCard from "./SecurityCard";
import { useGetSecurityProtocolsQuery } from "../../redux/api/security/getAllSecurityApi";
import Loader from "../../shared/Loader/Loader";

export default function SecurityProviders() {
  const { data: response, isLoading, isError } = useGetSecurityProtocolsQuery({ limit: 4, page: 1 });
  
  // Extract data from the nested structure: response.data.data
  const securityProviders = response?.data?.data || [];

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <section className="py-10 bg-white">
        <div className="container mx-auto px-5 md:px-0">
          <div className="text-center py-10">
            <div className="text-red-500 mb-2">Error loading security providers</div>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-5 md:px-0">
        {/* Section Header */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Security Providers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Discover trusted and professional security providers carefully
            verified for your safety. From personal bodyguards to event security
            teams and home patrol services, our featured partners are rated by
            customers for reliability, experience, and quality service. Book
            confidently knowing you are in safe hands.
          </p>
        </div>

        {securityProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityProviders.map((securityProvider) => (
              <SecurityCard 
                key={securityProvider.id} 
                securityProvider={securityProvider} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">No security providers found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
