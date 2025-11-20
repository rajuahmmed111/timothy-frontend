import React from "react";
import SecurityCard from "./SecurityCard";
import { useGetSecurityProtocolsRootQuery } from "../../redux/api/security/getAllSecurityApi";
import Loader from "../../shared/Loader/Loader";

export default function SecurityProviders() {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetSecurityProtocolsRootQuery({ limit: 50, page: 1 });

  const all = response?.data?.data || [];
  const types = [
    "Personal Bodyguard",
    "Security Guard",
    "Executive Protection",
    "Event Security",
    "Security Escort",
  ];
  const byType = types
    .map((t) => all.find((b) => b?.securityProtocolType === t))
    .filter(Boolean);
  const securityProviders = byType.map((b) => ({
    id: b?.id || b?._id,
    image: b?.businessLogo || "/placeholder.svg",
    name: b?.securityBusinessName || b?.securityName,
    location: b?.securityProtocolType,
    price: undefined,
    rating: 0,
  }));

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <section className="py-10 bg-white">
        <div className="container mx-auto px-5 md:px-0">
          <div className="text-center py-10">
            <div className="text-red-500 mb-2">
              Error loading security providers
            </div>
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
                to={`/security-protocol-details/${securityProvider.id}`}
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
