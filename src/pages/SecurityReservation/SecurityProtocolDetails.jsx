import React from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { MapPin, Phone, Mail, Shield, FileCheck, XCircle } from "lucide-react";
import { useGetSecurityProtocolByIdQuery } from "../../redux/api/security/securityApi";

export default function SecurityProtocolDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSecurityProtocolByIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const item = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!item || isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Unable to load protocol details.
        </p>
      </div>
    );
  }

  const detailCards = [
    {
      label: "Phone",
      value: item.securityPhone || "N/A",
      icon: Phone,
      color: "blue",
    },
    {
      label: "Email",
      value: item.securityEmail || "N/A",
      icon: Mail,
      color: "purple",
    },
    {
      label: "Registration",
      value: `${item.securityRegNum || "N/A"} ${
        item.securityRegDate ? `(${item.securityRegDate})` : ""
      }`,
      icon: FileCheck,
      color: "green",
    },
    {
      label: "Booking Condition",
      value: item.securityBookingCondition || "N/A",
      icon: Shield,
      color: "orange",
    },
    {
      label: "Cancellation Policy",
      value: item.securityCancelationPolicy || "N/A",
      icon: XCircle,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------- TOP BANNER ---------- */}
      <div className="relative h-56 md:h-72 w-full">
        <img
          src={item.coverImage || item.businessLogo || "/placeholder.svg"}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="container mx-auto px-4 -mt-14 pb-20 relative z-10 ">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 relative z-10">
          <button
            onClick={() => window.history.back()}
            className="mb-4 absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 shadow-sm hover:shadow-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Providers
          </button>
          {/* HEADER */}
          <div className="flex items-center gap-5">
            <img
              src={item.businessLogo || "/placeholder.svg"}
              alt="Logo"
              className="w-20 h-20 rounded-xl object-cover shadow-md border"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {item.securityBusinessName ||
                  item.securityName ||
                  "Security Service"}
              </h1>

              <p className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPin size={18} />
                {item.securityBusinessType ||
                  item.securityProtocolType ||
                  "Security Service"}
              </p>
            </div>
          </div>

          {/* TAGLINE */}
          {item.securityTagline && (
            <p className="mt-4 text-gray-700 italic border-l-4 border-blue-500 pl-4">
              "{item.securityTagline}"
            </p>
          )}

          {/* ---------- GRID ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {/* LEFT - ABOUT */}
            <div className="bg-gray-50 p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {item.securityProtocolDescription ||
                  "No description available."}
              </p>
            </div>

            {/* RIGHT - DETAILS */}
            <div className="space-y-4">
              {detailCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border shadow-sm hover:shadow-md transition"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl grid place-items-center bg-${card.color}-50 border border-${card.color}-200`}
                    >
                      <Icon className={`text-${card.color}-600 w-6 h-6`} />
                    </div>

                    <div>
                      <p className="text-xs uppercase text-gray-500">
                        {card.label}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {card.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------- PARTNER INFO ---------- */}
          {item.user && (
            <div className="mt-12 bg-gray-100 border rounded-xl p-5 flex items-center gap-4 shadow-inner">
              <img
                src={item.user.profileImage || "/placeholder.svg"}
                alt={item.user.fullName}
                className="w-14 h-14 rounded-full object-cover border shadow-sm"
              />
              <div>
                <p className="text-sm text-gray-500">Listed By</p>
                <p className="font-semibold text-gray-900">
                  {item.user.fullName}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
