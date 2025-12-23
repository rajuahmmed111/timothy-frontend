import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Spin } from "antd";
import { useGetSecurityProtocolsRootQuery } from "../../redux/api/security/getAllSecurityApi";
import SecurityCard from "./SecurityCard";

export default function SecurityServiceList() {
  const { type } = useParams();
  const { search } = useLocation();

  const decodedType = decodeURIComponent(type || "");
  const sp = new URLSearchParams(search);
  const country = sp.get("country") || undefined;
  const city = sp.get("city") || undefined;
  const fromDate = sp.get("fromDate") || undefined;
  const toDate = sp.get("toDate") || undefined;
  const sptype = sp.get("sptype") || undefined;
  const securityProtocolType =
    sp.get("securityProtocolType") || sptype || decodedType || undefined;

  const queryParams = {
    page: 1,
    limit: 50,
    ...(country && { country }),
    ...(city && { city }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
    // Do not apply server-side securityProtocolType filter; we will filter client-side
  };

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
  } = useGetSecurityProtocolsRootQuery(queryParams);

  const allBusinesses = response?.data?.data || response?.data || [];

  // Robust client-side filter by decoded type with title->server mapping
  const shouldClientFilter = decodedType && decodedType !== "All";
  const norm = (s) =>
    String(s || "")
      .toLowerCase()
      .trim();
  // Map UI titles to backend labels (expand as needed)
  const TITLE_TO_SERVER = {
    "personal bodyguard": "security guard",
    "security guard": "security guard",
    "executive protection": "executive protection",
    "event security": "event security",
    "security escort": "security escort",
  };
  const decodedNorm = norm(decodedType);
  const mapped = TITLE_TO_SERVER[decodedNorm] || decodedType;
  const needle = norm(mapped);
  const clientFiltered = shouldClientFilter
    ? allBusinesses.filter((b) => {
        const t1 = norm(b?.securityProtocolType);
        const t2 = norm(b?.security?.securityProtocolType);
        return (
          t1 === needle ||
          t2 === needle ||
          t1.includes(needle) ||
          t2.includes(needle) ||
          needle.includes(t1) ||
          needle.includes(t2)
        );
      })
    : allBusinesses;

  const finalList = clientFiltered.length > 0 ? clientFiltered : allBusinesses;

  const providers = finalList.map((b) => ({
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

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-16 text-center text-red-500">
        Failed to load providers for {decodedType}.
      </div>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-5 md:px-0">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {decodedType} Providers
          </h1>
          <p className="text-gray-600 mt-2">
            Browse providers matching your selection.
          </p>
        </div>

        {providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.map((securityProvider) => (
              <SecurityCard
                key={securityProvider.id}
                securityProvider={securityProvider}
                to={`/security-service-details/${securityProvider.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">
              No providers found for {decodedType}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
