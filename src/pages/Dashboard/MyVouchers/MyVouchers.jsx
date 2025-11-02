import React from "react";
import { Gift, Calendar } from "lucide-react";
import { useGetAllVoucherQuery } from "../../../redux/api/userDashboard/myBoucher";
import Loader from "../../../shared/Loader/Loader";

export default function MyVouchers() {
  const { data, isLoading, isError } = useGetAllVoucherQuery();
  const apiVouchers = Array.isArray(data?.data) ? data.data : [];

  const vouchers = apiVouchers.map((v) => {
    const now = new Date();
    const validFrom = v.validFrom ? new Date(v.validFrom) : null;
    const validTo = v.validTo ? new Date(v.validTo) : null;
    let status = "active";
    if (validTo && now > validTo) status = "expired";
    if (validFrom && now < validFrom) status = "active";
    return {
      id: v.id || v._id || v.code,
      title: "Promo Code",
      code: v.code,
      discount:
        typeof v.discountValue === "number"
          ? `${v.discountValue}% OFF`
          : `${v.discountValue}`,
      description: v.minimumAmount ? `Min spend ${v.minimumAmount}` : "",
      expiryDate: v.validTo || v.validFrom,
      status,
      category: "General",
      minAmount: v.minimumAmount ?? "",
      usageCount: "-",
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Voucher code ${code} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto mt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Vouchers</h1>
        </div>

        {isLoading && <Loader />}

        {isError && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load vouchers</h3>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        )}

        {/* Vouchers Grid */}
        {!isLoading && !isError && vouchers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-5">
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Voucher Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        voucher.status
                      )}`}
                    >
                      {voucher.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{voucher.title}</h3>
                  <p className="text-blue-100 text-sm">{voucher.category}</p>
                </div>

                {/* Voucher Body */}
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        {voucher.discount}
                      </span>
                      <Gift className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">
                      {voucher.description}
                    </p>
                  </div>

                {/* Voucher Code */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      VOUCHER CODE
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300">
                      <span className="font-mono font-bold text-lg">
                        {voucher.code}
                      </span>
                      
                    </div>
                  </div>

                  {/* Voucher Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Min. Amount:</span>
                      <span className="font-medium">{voucher.minAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Expires:
                      </span>
                      <span className="font-medium">
                        {voucher.expiryDate
                          ? new Date(voucher.expiryDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && vouchers.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vouchers found</h3>
            <p className="text-gray-600">You don't have any vouchers yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
