import React, { useState } from "react";
import {
  Search,
  Gift,
  CheckCircle,
  AlertCircle,
  Clock,
  Tag,
  HelpCircle,
  Star,
} from "lucide-react";

export default function FasifyCouponUsage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const couponTypes = [
    {
      id: 1,
      name: "Welcome Bonus",
      discount: "20%",
      type: "percentage",
      description: "New user discount for first booking",
      validFor: "Hotels, Cars, Attractions",
      minSpend: "$100",
      maxDiscount: "$50",
      validity: "30 days from signup",
      code: "WELCOME20",
      category: "new-user",
    },
    {
      id: 2,
      name: "Early Bird Special",
      discount: "$25",
      type: "fixed",
      description: "Book 30 days in advance and save",
      validFor: "Hotel bookings only",
      minSpend: "$200",
      maxDiscount: "$25",
      validity: "Valid for advance bookings",
      code: "EARLY25",
      category: "hotel",
    },
    {
      id: 3,
      name: "Weekend Getaway",
      discount: "15%",
      type: "percentage",
      description: "Weekend bookings discount",
      validFor: "Hotels and Cars",
      minSpend: "$150",
      maxDiscount: "$75",
      validity: "Friday-Sunday bookings",
      code: "WEEKEND15",
      category: "weekend",
    },
    {
      id: 4,
      name: "Loyalty Rewards",
      discount: "10%",
      type: "percentage",
      description: "Exclusive for Fasify Rewards members",
      validFor: "All services",
      minSpend: "$50",
      maxDiscount: "$100",
      validity: "Ongoing for members",
      code: "LOYALTY10",
      category: "loyalty",
    },
  ];

  const filteredCoupons = couponTypes.filter((coupon) => {
    const matchesSearch =
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || coupon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#0064D2] p-3 rounded-full">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Use of Fasify Coupon
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to use Fasify coupons to save money on your bookings.
              Find answers to common questions and discover available offers.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 md:px-0">
        {/* Available Coupons */}
        <div className="mb-12">
          {/* Coupon Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border-l-4 border-[#0064D2]"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {coupon.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {coupon.description}
                      </p>
                    </div>
                    <div className="bg-[#0064D2] text-white px-3 py-2 rounded-lg text-center min-w-[80px]">
                      <div className="text-lg font-bold">{coupon.discount}</div>
                      <div className="text-xs opacity-90">
                        {coupon.type === "percentage" ? "OFF" : "SAVE"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag className="w-4 h-4 mr-2" />
                      <span className="font-medium">Code:</span>
                      <span className="ml-1 font-mono bg-gray-100 px-2 py-1 rounded">
                        {coupon.code}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="font-medium">Valid for:</span>
                      <span className="ml-1">{coupon.validFor}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-2" />
                      <span className="font-medium">Min spend:</span>
                      <span className="ml-1">{coupon.minSpend}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Validity:</span>
                      <span className="ml-1">{coupon.validity}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full bg-[#0064D2] text-white py-2 rounded-lg font-medium hover:bg-[#0052A3] transition-colors">
                      Use This Coupon
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-amber-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-3">
                Important Notes
              </h3>
              <ul className="space-y-2 text-amber-700">
                <li>
                  • Coupons cannot be combined with other offers or promotions
                </li>
                <li>• Each coupon can only be used once per account</li>
                <li>
                  • Coupons are non-transferable and cannot be exchanged for
                  cash
                </li>
                <li>
                  • Some coupons may have blackout dates or service restrictions
                </li>
                <li>
                  • Always check the terms and conditions before using a coupon
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
