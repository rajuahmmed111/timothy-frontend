import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetHumanRightsPolicyQuery } from "../../redux/api/policy/cancellation";

export default function HumanRightsStatement() {
  const [activeTab, setActiveTab] = useState("static");
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
            Human Rights Statement
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Last updated: September 16, 2025
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("static")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "static"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Official Statement
            </button>
            <button
              onClick={() => setActiveTab("dynamic")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dynamic"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dynamic Policy
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "static" && (
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Our Commitment
              </h2>
              <p className="text-gray-700">
                At FASIFY, we are committed to respecting and promoting human
                rights in all aspects of our business operations. We believe
                that access to travel, accommodation, and transportation
                services should be available to all people regardless of their
                race, ethnicity, gender, sexual orientation, religion,
                disability, age, or nationality. This Human Rights Statement
                outlines our commitment to upholding fundamental human rights
                principles.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Non-Discrimination Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We are committed to providing equal access to our services
                without discrimination based on:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Race, color, or ethnicity</li>
                <li>Gender identity or expression</li>
                <li>Sexual orientation</li>
                <li>Religious beliefs or practices</li>
                <li>Disability or accessibility needs</li>
                <li>Age (subject to legal requirements)</li>
                <li>Nationality or immigration status</li>
                <li>Political opinions or affiliations</li>
                <li>Socioeconomic status</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Accessibility and Inclusion
              </h2>
              <p className="text-gray-700 mb-4">
                We strive to make our platform accessible to all users,
                including those with disabilities:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Our website follows WCAG 2.1 accessibility guidelines</li>
                <li>
                  We provide accessible booking options and clear accessibility
                  information for accommodations
                </li>
                <li>
                  We work with service providers to ensure accessible facilities
                  and services
                </li>
                <li>
                  We offer multiple communication channels to assist users with
                  different needs
                </li>
                <li>
                  We continuously improve our platform based on user feedback
                  and accessibility standards
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Labor Rights and Fair Employment
              </h2>
              <p className="text-gray-700 mb-4">
                We are committed to fair labor practices and respect for
                workers' rights:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  We prohibit forced labor, child labor, and human trafficking
                  in our operations and supply chain
                </li>
                <li>
                  We ensure fair wages, reasonable working hours, and safe
                  working conditions
                </li>
                <li>
                  We respect workers' rights to freedom of association and
                  collective bargaining
                </li>
                <li>
                  We promote diversity, equity, and inclusion in our workplace
                </li>
                <li>
                  We provide equal opportunities for professional development
                  and advancement
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 mb-4">
                We recognize privacy as a fundamental human right:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  We collect and process personal data only with proper consent
                  and for legitimate purposes
                </li>
                <li>
                  We implement robust security measures to protect user data
                </li>
                <li>
                  We provide transparency about our data collection and usage
                  practices
                </li>
                <li>
                  We respect users' rights to access, correct, and delete their
                  personal information
                </li>
                <li>
                  We comply with applicable data protection laws and regulations
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Community Safety and Security
              </h2>
              <p className="text-gray-700 mb-4">
                We are committed to creating a safe environment for all users:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  We have zero tolerance for harassment, discrimination, or
                  violence
                </li>
                <li>
                  We provide reporting mechanisms for safety concerns and
                  inappropriate behavior
                </li>
                <li>
                  We work with law enforcement when necessary to address serious
                  safety issues
                </li>
                <li>
                  We verify the identity of service providers to ensure user
                  safety
                </li>
                <li>
                  We provide safety resources and guidelines for travelers
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Environmental Responsibility
              </h2>
              <p className="text-gray-700 mb-4">
                We recognize the right to a healthy environment and promote
                sustainable travel:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  We promote eco-friendly accommodations and transportation
                  options
                </li>
                <li>
                  We provide information about sustainable travel practices
                </li>
                <li>
                  We work to minimize our environmental impact through
                  digital-first operations
                </li>
                <li>
                  We support local communities and responsible tourism
                  initiatives
                </li>
                <li>We encourage carbon offset programs for travelers</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Supply Chain Responsibility
              </h2>
              <p className="text-gray-700 mb-4">
                We expect our partners and service providers to uphold human
                rights standards:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  We conduct due diligence on our business partners regarding
                  human rights practices
                </li>
                <li>
                  We include human rights clauses in our contracts with service
                  providers
                </li>
                <li>
                  We provide training and resources to help partners meet our
                  standards
                </li>
                <li>
                  We investigate and address reported human rights violations in
                  our supply chain
                </li>
                <li>
                  We reserve the right to terminate partnerships that violate
                  human rights principles
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Grievance and Reporting Mechanisms
              </h2>
              <p className="text-gray-700 mb-4">
                We provide multiple channels for reporting human rights
                concerns:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Online reporting form available on our website</li>
                <li>
                  Dedicated email address for human rights concerns:
                  humanrights@fasify.com
                </li>
                <li>Anonymous reporting options to protect whistleblowers</li>
                <li>
                  Regular review and investigation of all reported concerns
                </li>
                <li>Protection against retaliation for good faith reporting</li>
              </ul>
            </div>

            <div className="mb-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Contact Us
              </h3>
              <p className="text-blue-700">
                If you have questions about our Human Rights Statement or need
                to report a concern, please contact us at
                <a
                  href="mailto:humanrights@fasify.com"
                  className="text-blue-600 hover:underline"
                >
                  humanrights@fasify.com
                </a>
                or call our Human Rights Hotline at +1 (555) 987-6543.
              </p>
            </div>
          </div>
        )}

        {activeTab === "dynamic" && (
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dynamic Human Rights Policy
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
                    Unable to load the human rights policy. Please try again
                    later or contact support.
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
                  This dynamic human rights policy is regularly updated to
                  reflect our ongoing commitment to human rights and social
                  responsibility. The policy complements our official Human
                  Rights Statement and provides additional context on our
                  practices and commitments.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
