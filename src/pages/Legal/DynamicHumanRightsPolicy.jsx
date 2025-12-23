import React from "react";
import { Link } from "react-router-dom";
import { useGetHumanRightsPolicyQuery } from "../../redux/api/policy/cancellation";

export default function DynamicHumanRightsPolicy() {
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
            Human Rights Policy
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Last updated: September 16, 2025
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <Link
              to="/official-statement"
              className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Official Statement
            </Link>
            <button className="py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
              Human Right Policy
            </button>
          </nav>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Human Rights Policy
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
                  Unable to load the human rights policy. Please try again later
                  or contact support.
                </p>
              </div>
            )}

            {humanRightsPolicy?.data?.length > 0 && (
              <div className="space-y-6">
                {humanRightsPolicy.data.map((policy) => (
                  <div key={policy.id} className="bg-gray-50 p-6 rounded-lg">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Human Rights Policy Statement
                      </h3>
                      <div className="text-gray-700">
                        <p>{policy.description}</p>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>
                          Last updated:{" "}
                          {new Date(policy.updatedAt).toLocaleDateString()}
                        </p>
                        <p>
                          Created:{" "}
                          {new Date(policy.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-md p-4">
              <h3 className="text-purple-800 font-medium mb-2">
                Policy Notice
              </h3>
              <p className="text-purple-700">
                This human rights policy is regularly updated to reflect our
                ongoing commitment to human rights and social responsibility.
                The policy complements our official Human Rights Statement and
                provides additional context on our practices and commitments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
