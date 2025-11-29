import React, { useState } from "react";
import { useGetRefundPoliciesQuery } from "../../redux/api/policy/refund";

export default function RefundPolicies() {
  const [activeTab, setActiveTab] = useState("accept");
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
              Refund Policies
            </button>
            <button
              onClick={() => setActiveTab("accept")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "accept"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Acceptable Use Policy
            </button>
          </nav>
        </div>
        {activeTab === "accept" && (
          <div className="min-h-screen  ">
            <div className=" mx-auto bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold mb-4">
                Fasify – Acceptable Use Policy
              </h1>

              <p className="mb-4 text-gray-700">
                This Acceptable Use Policy (“AUP”) governs the use of the Fasify
                platform by all Guests, Property Owners, and Vendors. By
                accessing Fasify, you agree to comply with all standards, rules,
                and obligations outlined herein.
              </p>

              <section className="mt-4">
                <h2 className="text-lg font-semibold mb-2">
                  <span className="font-semibold mr-2">1.</span> Prohibited
                  Conduct
                </h2>
                <p className="text-gray-700">Users shall not engage in:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>
                    Fraud, misrepresentation, or provision of false documents.
                  </li>
                  <li>Listing properties without legal authorization.</li>
                  <li>Abuse, harassment, or threatening behavior.</li>
                  <li>
                    Uploading unlawful, obscene, defamatory, or misleading
                    content.
                  </li>
                  <li>
                    Security violations, hacking attempts, reverse engineering,
                    or distribution of malware.
                  </li>
                  <li>
                    Any activity that violates local, national, or international
                    law.
                  </li>
                </ul>
              </section>

              <section className="mt-6">
                <h2 className="text-lg font-semibold mb-2">
                  <span className="font-semibold mr-2">2.</span> Obligations of
                  Property Owners
                </h2>
                <p className="text-gray-700">Owners must:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>Provide truthful property descriptions.</li>
                  <li>Maintain legally compliant and safe accommodations.</li>
                  <li>Uphold all confirmed bookings.</li>
                  <li>
                    Ensure compliance with housing, zoning, and regulatory
                    requirements.
                  </li>
                </ul>
              </section>

              <section className="mt-6">
                <h2 className="text-lg font-semibold mb-2">
                  <span className="font-semibold mr-2">3.</span> Obligations of
                  Guests
                </h2>
                <p className="text-gray-700">Guests must:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>Provide accurate identifying information.</li>
                  <li>Comply with property rules and respect neighbors.</li>
                  <li>Avoid property damage or illegal use of the premises.</li>
                </ul>
              </section>

              <section className="mt-6">
                <h2 className="text-lg font-semibold mb-2">
                  <span className="font-semibold mr-2">4.</span> Enforcement
                </h2>
                <p className="text-gray-700">Fasify reserves the right to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>Suspend or terminate accounts.</li>
                  <li>Remove listings or block transactions.</li>
                  <li>Report unlawful activities to regulatory bodies.</li>
                </ul>
              </section>

              <section className="mt-6 border-t pt-4">
                <h3 className="text-md font-semibold">Contact</h3>
                <p className="text-gray-700">
                  For questions, contact us at{" "}
                  <a
                    href="mailto:support@fasifys.com"
                    className="text-blue-600 hover:underline"
                  >
                    support@fasifys.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        )}
        {/* Tab Content */}
        {activeTab === "general" && (
          <div className="mx-auto bg-white p-6 rounded-lg shadow-sm ">
            <h1 className="text-2xl font-bold mb-4">Fasify – Refund Policy</h1>

            <p className="text-gray-700 mb-4">
              This Refund Policy outlines the conditions under which refunds may
              be issued to users of Fasify.
            </p>

            <section className="mt-4">
              <h2 className="text-lg font-semibold mb-2">
                <span className="font-semibold mr-2">1.</span> Guest
                Cancellations
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Free cancellation within 24–48 hours before check-in.</li>
                <li>
                  50% refund for cancellations less than 24 hours before
                  check-in.
                </li>
                <li>
                  No refund within 12 hours of check-in except for special
                  circumstances.
                </li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-lg font-semibold mb-2">
                <span className="font-semibold mr-2">2.</span> Host
                Cancellations
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>100% refund to guest.</li>
                <li>Fasify provides priority rebooking support.</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-lg font-semibold mb-2">
                <span className="font-semibold mr-2">3.</span> Property Not as
                Described
              </h2>
              <p className="text-gray-700 mb-2">
                Refunds or relocations may be offered if:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Property access is denied.</li>
                <li>Listing is materially inaccurate.</li>
                <li>Property is unsafe or uninhabitable.</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-lg font-semibold mb-2">
                <span className="font-semibold mr-2">4.</span> Special
                Circumstances
              </h2>
              <p className="text-gray-700 mb-2">
                Special circumstances may require documentation, including but
                not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Medical emergencies.</li>
                <li>Natural disasters.</li>
                <li>Government restrictions.</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-lg font-semibold mb-2">
                <span className="font-semibold mr-2">5.</span> Refund Processing
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Refunds are typically issued within 5–10 business days.</li>
              </ul>
            </section>

            <section className="mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              <p className="text-gray-700">
                For questions or support regarding refunds, please contact us at{" "}
                <a
                  href="mailto:support@fasifys.com"
                  className="text-blue-600 hover:underline"
                >
                  support@fasifys.com
                </a>
                .
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
