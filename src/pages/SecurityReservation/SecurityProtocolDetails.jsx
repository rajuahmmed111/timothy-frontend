import React from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { MapPin } from "lucide-react";
import { useGetSecurityProtocolByIdQuery } from "../../redux/api/security/securityApi";

export default function SecurityProtocolDetails() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetSecurityProtocolByIdQuery(
    id,
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );

  console.log("data", data?.data);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    console.error("Error loading protocol:", error);
    // Continue rendering even if there's an error, as we want to show available data
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">No protocol details found</p>
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
                src={data?.data?.businessLogo || "/placeholder.svg"}
                alt={
                  data?.data?.securityBusinessName ||
                  data?.data?.securityName ||
                  "Security Protocol"
                }
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {data?.data?.securityBusinessName ||
                    data?.data?.securityName ||
                    "Security Service"}
                </h1>
                <div className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {data?.data?.securityBusinessType ||
                      data?.data?.securityProtocolType ||
                      "Security Service"}
                  </span>
                </div>
              </div>
            </div>

            {data?.data?.securityTagline && (
              <p className="text-gray-700 mb-4">
                {data?.data?.securityTagline}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {data?.data?.securityProtocolDescription ||
                    "No description provided."}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {data?.data?.securityPhone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {data?.data?.securityEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration</p>
                  <p className="font-medium">
                    {data?.data?.securityRegNum || "N/A"}{" "}
                    {data?.data?.securityRegDate
                      ? `(${data?.data?.securityRegDate})`
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Condition</p>
                  <p className="font-medium">
                    {data?.data?.securityBookingCondition || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cancellation Policy</p>
                  <p className="font-medium">
                    {data?.data?.securityCancelationPolicy || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {data?.data?.user && (
              <div className="mt-8 flex items-center gap-3">
                <img
                  src={data?.data?.user?.profileImage || "/placeholder.svg"}
                  alt={data?.data?.user?.fullName || "Partner"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-500">Partner</p>
                  <p className="font-medium">{data?.data?.user?.fullName}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
