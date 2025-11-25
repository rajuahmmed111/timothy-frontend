import React, { useState } from "react";
import { useGetRefundPoliciesQuery } from "../../redux/api/policy/refund";

export default function RefundPolicies() {
  const [activeTab, setActiveTab] = useState("general");
  const {
    data: refundPolicies,
    isLoading,
    error,
  } = useGetRefundPoliciesQuery();

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Refund Timeline, Policies & Process
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Understanding our refund policies and what to expect
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("general")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "general"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              General Policies
            </button>
            <button
              onClick={() => setActiveTab("dynamic")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dynamic"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dynamic Policies
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "general" && (
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Fasify – Refund Policy
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-6">
                  This Refund Policy outlines the conditions under which refunds
                  may be issued to users of Fasify.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      1. Guest Cancellations
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>
                        Free cancellation within 24-48 hours before check-in
                      </li>
                      <li>
                        50% refund for cancellations less than 24 hours before
                        check-in
                      </li>
                      <li>
                        No refund within 12 hours of check-in except for special
                        circumstances
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      2. Host Cancellations
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>100% refund to guest</li>
                      <li>Fasify provides priority rebooking support</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      3. Property Not as Described
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Refunds or relocations may be offered if:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Property access is denied</li>
                      <li>Listing is materially inaccurate</li>
                      <li>Property is unsafe or uninhabitable</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      4. Special Circumstances
                    </h3>
                    <p className="text-gray-700 mb-2">
                      May require documentation:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Medical emergencies</li>
                      <li>Natural disasters</li>
                      <li>Government restrictions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      5. Refund Processing
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Refunds issued within 5–10 business days</li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-gray-700">
                      <strong>Contact:</strong> support@fasifys.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Refund Timeline
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">1</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Request Received
                      </h3>
                      <p className="mt-1 text-gray-600">
                        Immediately after submission
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">2</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Processing
                      </h3>
                      <p className="mt-1 text-gray-600">1-3 business days</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">3</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Refund Issued
                      </h3>
                      <p className="mt-1 text-gray-600">7-10 business days</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Time may vary by payment method and financial
                        institution
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Refund Policies
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Standard Bookings
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Full refund if cancelled 48+ hours before check-in</li>
                    <li>
                      50% refund if cancelled within 24-48 hours of check-in
                    </li>
                    <li>
                      No refund for no-shows or cancellations within 24 hours of
                      check-in
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Non-Refundable Rates
                  </h3>
                  <p className="text-gray-700">
                    Some special rates or offers may be non-refundable. These
                    will be clearly marked at the time of booking.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Third-Party Bookings
                  </h3>
                  <p className="text-gray-700">
                    Bookings made through third-party websites or travel
                    agencies are subject to their specific refund policies.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">
                Important Information
              </h3>
              <ul className="list-disc pl-6 text-yellow-700 space-y-2">
                <li>
                  Refund processing times are estimates and may vary by
                  financial institution
                </li>
                <li>
                  Original payment method will be credited unless otherwise
                  specified
                </li>
                <li>Currency conversion fees are non-refundable</li>
                <li>Service fees may be non-refundable in certain cases</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Need Assistance?
              </h3>
              <p className="text-blue-700">
                If you have questions about your refund or need further
                assistance, please contact our support team at
                <a
                  href="mailto:refunds@fasify.com"
                  className="text-blue-600 hover:underline"
                >
                  refunds@fasify.com
                </a>
                or call us at +1 (555) 987-6544.
              </p>
            </div>
          </div>
        )}

        {activeTab === "dynamic" && (
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dynamic Refund Policies
              </h2>

              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">
                    Loading refund policies...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h3 className="text-red-800 font-medium">
                    Error Loading Policies
                  </h3>
                  <p className="text-red-600 mt-1">
                    Unable to load refund policies. Please try again later or
                    contact support.
                  </p>
                </div>
              )}

              {refundPolicies?.data?.length > 0 && (
                <div className="space-y-6">
                  {refundPolicies.data.map((policy) => (
                    <div key={policy.id} className="bg-gray-50 p-6 rounded-lg">
                      <div className="prose max-w-none">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Refund Policy
                        </h3>
                        <div className="text-gray-700">
                          <p>{policy.description}</p>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          <p>
                            Last updated:{" "}
                            {new Date(policy.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-green-800 font-medium mb-2">
                  Policy Information
                </h3>
                <p className="text-green-700">
                  These refund policies are dynamically updated to reflect the
                  most current terms and conditions. Please review them
                  carefully before making any booking decisions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
