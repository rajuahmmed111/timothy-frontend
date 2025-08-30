import React from 'react';
export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Last updated: August 30, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700">
              These Terms and Conditions ("Terms") govern your use of the FASIFY website and services. By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>"Service"</strong> refers to the FASIFY website and related services.</li>
              <li><strong>"User"</strong> refers to anyone who accesses or uses our Service.</li>
              <li><strong>"Content"</strong> refers to text, images, or other information that can be posted, uploaded, linked to, or otherwise made available by Users.</li>
              <li><strong>"Account"</strong> means a unique account created for Users to access our Service.</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="text-gray-700 mb-4">When you create an account with us, you must provide us with accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
            <p className="text-gray-700">You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Bookings and Payments</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All bookings are subject to availability.</li>
              <li>Prices are subject to change without notice.</li>
              <li>Payment must be made in full at the time of booking unless otherwise specified.</li>
              <li>Cancellation policies vary by service provider and will be clearly stated at the time of booking.</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">As a user of our Service, you agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
              <li>Harass, abuse, or harm another person or entity.</li>
              <li>Attempt to gain unauthorized access to any portion of the Service.</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
              <li>Use any robot, spider, or other automatic device to access the Service for any purpose without our express written permission.</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700">
              The Service and its original content, features, and functionality are and will remain the exclusive property of FASIFY and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700">
              In no event shall FASIFY, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms, please contact us at:
            </p>
            <address className="mt-2 not-italic text-gray-700">
              FASIFY Inc.<br />
              Email: legal@fasify.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Business Ave, Suite 100, New York, NY 10001
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
