import React, { useState, useEffect } from "react";
import {
  useGetHumanRightsCancellationPolicyQuery,
  useGetHumanRightsPolicyQuery,
} from "../../redux/api/policy/cancellation";

export default function CancelReservation() {
  const [activeTab, setActiveTab] = useState("general");
  const {
    data: humanRightsPolicy,
    isLoading,
    error,
  } = useGetHumanRightsPolicyQuery();

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Cancel Your Reservation
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            How to cancel your booking and what to expect
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
              General Cancellation
            </button>
            <button
              onClick={() => setActiveTab("human-rights")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "human-rights"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Human Rights Policy
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "general" && (
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How to Cancel
              </h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-4">
                <li>
                  <strong>Sign in</strong> to your FASIFY account
                  <p className="text-gray-600 mt-1">
                    Go to 'My Bookings' in your account dashboard
                  </p>
                </li>
                <li>
                  <strong>Select</strong> the booking you wish to cancel
                  <p className="text-gray-600 mt-1">
                    Click on the booking details to view cancellation options
                  </p>
                </li>
                <li>
                  <strong>Choose</strong> 'Cancel Reservation'
                  <p className="text-gray-600 mt-1">
                    Review the cancellation policy and any applicable fees
                  </p>
                </li>
                <li>
                  <strong>Confirm</strong> your cancellation
                  <p className="text-gray-600 mt-1">
                    You'll receive a confirmation email once processed
                  </p>
                </li>
              </ol>
            </div>

            <div className="mb-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Need Help?
              </h3>
              <p className="text-blue-700">
                If you're having trouble canceling online, please contact our
                customer support team at
                <a
                  href="mailto:support@fasify.com"
                  className="text-blue-600 hover:underline"
                >
                  support@fasify.com
                </a>
                or call us at +1 (555) 987-6543.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Important Notes
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  Cancellation policies vary by service provider and booking
                  type
                </li>
                <li>
                  Some bookings may be non-refundable or have specific
                  cancellation deadlines
                </li>
                <li>
                  Refunds, when applicable, will be processed within 7-10
                  business days
                </li>
                <li>
                  Third-party bookings may have different cancellation
                  procedures
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "human-rights" && (
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Human Rights Cancellation Policy
              </h2>

              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">
                    Loading human rights policy...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h3 className="text-red-800 font-medium">
                    Error Loading Policy
                  </h3>
                  <p className="text-red-600 mt-1">
                    Unable to load the human rights cancellation policy. Please
                    try again later or contact support.
                  </p>
                </div>
              )}

              {humanRightsPolicy?.data?.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Human Rights Cancellation Policy
                    </h3>
                    <div className="text-gray-700">
                      {humanRightsPolicy.data.map((policy) => (
                        <div key={policy.id} className="mb-4">
                          <p>{policy.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Last updated:{" "}
                            {new Date(policy.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-yellow-800 font-medium mb-2">
                  Important Notice
                </h3>
                <p className="text-yellow-700">
                  This policy ensures that all users have fair and equitable
                  access to cancellation procedures, regardless of background,
                  ability, or circumstance. If you believe your rights have been
                  violated during the cancellation process, please contact our
                  compliance team immediately.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
