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
    ...(securityProtocolType && { securityProtocolType }),
  };

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
  } = useGetSecurityProtocolsRootQuery(queryParams);

  const allBusinesses = response?.data?.data || response?.data || [];
  const needClientFilter =
    !securityProtocolType && decodedType && decodedType !== "All";
  const filtered = needClientFilter
    ? allBusinesses.filter((b) => b?.securityProtocolType === decodedType)
    : allBusinesses;
  const providers = filtered.map((b) => ({
    id: b?.id || b?._id,
    image: b?.businessLogo || "/placeholder.svg",
    name: b?.securityBusinessName || b?.securityName,
    location: b?.securityBusinessType || b?.securityProtocolType || "",
    price: undefined,
    rating: 0,
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
