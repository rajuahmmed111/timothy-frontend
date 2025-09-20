import React from 'react';

export default function RefundPolicies() {
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

        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Timeline</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">1</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Request Received</h3>
                    <p className="mt-1 text-gray-600">Immediately after submission</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">2</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Processing</h3>
                    <p className="mt-1 text-gray-600">1-3 business days</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">3</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Refund Issued</h3>
                    <p className="mt-1 text-gray-600">7-10 business days</p>
                    <p className="text-sm text-gray-500 mt-1">Time may vary by payment method and financial institution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policies</h2>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Standard Bookings</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Full refund if cancelled 48+ hours before check-in</li>
                  <li>50% refund if cancelled within 24-48 hours of check-in</li>
                  <li>No refund for no-shows or cancellations within 24 hours of check-in</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Non-Refundable Rates</h3>
                <p className="text-gray-700">Some special rates or offers may be non-refundable. These will be clearly marked at the time of booking.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Third-Party Bookings</h3>
                <p className="text-gray-700">Bookings made through third-party websites or travel agencies are subject to their specific refund policies.</p>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">Important Information</h3>
            <ul className="list-disc pl-6 text-yellow-700 space-y-2">
              <li>Refund processing times are estimates and may vary by financial institution</li>
              <li>Original payment method will be credited unless otherwise specified</li>
              <li>Currency conversion fees are non-refundable</li>
              <li>Service fees may be non-refundable in certain cases</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Need Assistance?</h3>
            <p className="text-blue-700">
              If you have questions about your refund or need further assistance, please contact our support team at 
              <a href="mailto:refunds@fasify.com" className="text-blue-600 hover:underline">refunds@fasify.com</a> 
              or call us at +1 (555) 987-6544.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
