import React from "react";

import ServiceCard from "../../components/ServiceCard/ServiceCard";
import SecurityCard from "./SecurityCard";
import { useGetSecurityProtocolsQuery } from "../../redux/api/security/getAllSecurityApi";

export default function AvailableService() {
  const { data, isLoading, isError } = useGetSecurityProtocolsQuery({
    limit: 50,
    page: 1,
  });
  const services = [
    {
      title: "Personal Bodyguard",
      image: "/security/1.png",
      // icon: House,
      description: "24 available",
      to: `/security-details?securityType=${encodeURIComponent(
        "Personal Bodyguard"
      )}`,
    },
    {
      title: "Security Guard",
      image: "/security/2.png",
      // icon: Car,
      description: "12 available",
      to: `/security-details?securityType=${encodeURIComponent(
        "Security Guard"
      )}`,
    },
    {
      title: "Executive Protection",
      image: "/security/3.png",
      // icon: Shield,
      description: "20 available",
      to: `/security-details?securityType=${encodeURIComponent(
        "Executive Protection"
      )}`,
    },
    {
      title: "Event Security",
      image: "/security/4.png",
      // icon: MapPin,
      description: "25 available",
      to: `/security-details?securityType=${encodeURIComponent(
        "Event Security"
      )}`,
    },
    {
      title: "Security Escort",
      image: "/security/5.jpg",
      // icon: MapPin,
      description: "25 available",
      to: `/security-details?securityType=${encodeURIComponent(
        "Security Escort"
      )}`,
    },
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-5 md:px-0">
        {/* Section Header */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Our All Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
            From comfortable accommodations and reliable car rentals, to
            security protocols and local attractions — everything you need for a
            perfect trip.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>

        {/* Dynamic Guards (from API) */}
        {(() => {
          const list = Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
            ? data
            : [];
          if (!list.length) return null;
          const providers = list.map((b) => ({
            id: b?.id || b?._id,
            image:
              b?.businessLogo ||
              (Array.isArray(b?.securityImages) && b.securityImages.length > 0
                ? b.securityImages[0]
                : undefined) ||
              "/placeholder.svg",
            name:
              b?.securityBusinessName ||
              b?.securityName ||
              b?.securityGuardName ||
              "Security Provider",
            location:
              b?.securityBusinessType ||
              b?.securityProtocolType ||
              b?.securityCity ||
              b?.securityDistrict ||
              b?.securityAddress ||
              "",
            price: b?.securityPriceDay,
            rating: Number(b?.securityRating) || 0,
          }));
          return (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Security Guards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {providers.map((p) => {
                  const typeValue = p.type || p.location || "Security Provider";
                  return (
                    <SecurityCard
                      key={p.id}
                      securityProvider={p}
                      to={`/security-details?securityType=${encodeURIComponent(
                        typeValue
                      )}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
