import React from "react";
import { Link } from "react-router-dom";

export default function AcceptableUsePolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Acceptable Use Policy
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Guidelines for proper use of the Fasify platform
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <Link
              to="/refund-policies"
              className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Refund Policy
            </Link>
            <button className="py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
              Acceptable Use Policy
            </button>
          </nav>
        </div>

        <div className="min-h-screen">
          <div className="mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">
              Fasify – Acceptable Use Policy
            </h1>

            <p className="mb-4 text-gray-700">
              This Acceptable Use Policy ("AUP") governs the use of the Fasify
              platform by all Guests, Property Owners, and Vendors. By accessing
              Fasify, you agree to comply with all standards, rules, and
              obligations outlined herein.
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
                  Security violations, hacking attempts, reverse engineering, or
                  distribution of malware.
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
      </div>
    </div>
  );
}
