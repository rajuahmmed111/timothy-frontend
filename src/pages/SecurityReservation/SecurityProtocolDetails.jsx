import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { MapPin } from "lucide-react";
import { useGetSecurityProtocolByIdQuery } from "../../redux/api/security/securityApi";

export default function SecurityProtocolDetails() {
  const { id } = useParams();
  const { data, isLoading, isFetching, isError, error } = useGetSecurityProtocolByIdQuery(id, { skip: !id });

  const protocol = useMemo(() => {
    if (data?.protocol) return data.protocol;
    // Try common API shapes
    return (
      data?.data?.data ||
      data?.data ||
      data?.result ||
      data ||
      null
    );
  }, [data]);

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if ((isError || !protocol) && !isLoading && !isFetching) {
    const status = error?.status;
    const message = error?.data?.message || "";
    const isUnauthorized = status === 401 || /not authorized/i.test(message);
    if (isUnauthorized) {
      const redirect = encodeURIComponent(window.location.pathname + window.location.search);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-900">You are not authorized</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please log in to view this protocol. You will be redirected back here after login.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <a
                href={`/login?redirect=${redirect}`}
                className="px-4 py-2 rounded-lg bg-[#0064D2] text-white hover:bg-[#0052ad]"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="text-center">
          <div className="mb-2 font-semibold">
            Failed to load protocol details{ id ? ` for ${id}` : "" }.
          </div>
          {error && (
            <div className="text-sm text-gray-600">
              {typeof error?.status !== 'undefined' && <div>Status: {String(error.status)}</div>}
              {error?.data?.message && <div>Message: {error.data.message}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={protocol?.businessLogo || "/placeholder.svg"}
                alt={protocol?.securityBusinessName || protocol?.securityName}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {protocol?.securityBusinessName || protocol?.securityName}
                </h1>
                <div className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {protocol?.securityBusinessType ||
                      protocol?.securityProtocolType}
                  </span>
                </div>
              </div>
            </div>

            {protocol?.securityTagline && (
              <p className="text-gray-700 mb-4">{protocol.securityTagline}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {protocol?.securityProtocolDescription ||
                    "No description provided."}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {protocol?.securityPhone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {protocol?.securityEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration</p>
                  <p className="font-medium">
                    {protocol?.securityRegNum || "N/A"} (
                    {protocol?.securityRegDate || ""})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Condition</p>
                  <p className="font-medium">
                    {protocol?.securityBookingCondition || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cancellation Policy</p>
                  <p className="font-medium">
                    {protocol?.securityCancelationPolicy || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {protocol?.user && (
              <div className="mt-8 flex items-center gap-3">
                <img
                  src={protocol?.user?.profileImage || "/placeholder.svg"}
                  alt={protocol?.user?.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-500">Partner</p>
                  <p className="font-medium">{protocol?.user?.fullName}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
