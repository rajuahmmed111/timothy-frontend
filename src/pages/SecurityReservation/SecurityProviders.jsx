import React from "react";
import { Link } from "react-router-dom";
import { useGetSecurityProtocolsRootQuery } from "../../redux/api/security/getAllSecurityApi";
import Loader from "../../shared/Loader/Loader";

export default function SecurityProviders() {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetSecurityProtocolsRootQuery({ limit: 50, page: 1 });

  const all = response?.data?.data || [];

  const TYPES = [
    "Personal Bodyguard",
    "Security Guard",
    "Executive Protection",
    "Event Security",
    "Security Escort",
  ];

  const normalize = (value) => (value || "").toLowerCase().trim();

  const selected = [];
  const usedIds = new Set();

  TYPES.forEach((type) => {
    const normalizedType = normalize(type);
    const match = all.find(
      (b) =>
        normalize(b?.securityProtocolType) === normalizedType ||
        normalize(b?.security?.securityProtocolType) === normalizedType
    );
    const id = match?.id || match?._id;
    if (match && id && !usedIds.has(id)) {
      selected.push(match);
      usedIds.add(id);
    }
  });

  const fallback = all.filter((b) => {
    const id = b?.id || b?._id;
    return id && !usedIds.has(id);
  });

  const securityProviders = [...selected, ...fallback].slice(0, 5).map((b) => ({
    id: b?.id || b?._id,
    image: b?.businessLogo || "/placeholder.svg",
    name: b?.securityBusinessName || b?.securityName,
    location: b?.securityProtocolType,
    price: b?.price || "—",
    rating: b?.rating || 0,
  }));

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-5 md:px-0 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Error loading security providers
          </h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
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
            customers for reliability, experience, and quality service.
          </p>
        </div>

        {/* Providers Grid */}
        {securityProviders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityProviders.map((provider) => (
              <Link
                key={provider.id}
                to={`/security-protocol-details/${provider.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {provider.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {provider.location}
                </p>

                {/* <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-700 font-medium">
                    Price:{" "}
                    <span className="text-gray-900 font-bold">
                      {provider.price === "—"
                        ? "Not provided"
                        : `$${provider.price}`}
                    </span>
                  </span>
                </div> */}

                <div className="mt-4 w-full py-2 text-center bg-gray-900 text-white rounded-lg font-semibold">
                  View Details
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <img
              src="/no-data.png"
              alt="No providers"
              className="mx-auto w-40 opacity-80"
            />
            <p className="text-gray-600 text-lg mt-4">
              No security providers found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
