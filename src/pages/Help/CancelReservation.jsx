import React from 'react';

export default function CancelReservation() {
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

        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Cancel</h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-4">
              <li>
                <strong>Sign in</strong> to your FASIFY account
                <p className="text-gray-600 mt-1">Go to 'My Bookings' in your account dashboard</p>
              </li>
              <li>
                <strong>Select</strong> the booking you wish to cancel
                <p className="text-gray-600 mt-1">Click on the booking details to view cancellation options</p>
              </li>
              <li>
                <strong>Choose</strong> 'Cancel Reservation'
                <p className="text-gray-600 mt-1">Review the cancellation policy and any applicable fees</p>
              </li>
              <li>
                <strong>Confirm</strong> your cancellation
                <p className="text-gray-600 mt-1">You'll receive a confirmation email once processed</p>
              </li>
            </ol>
          </div>

          <div className="mb-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Need Help?</h3>
            <p className="text-blue-700">
              If you're having trouble canceling online, please contact our customer support team at 
              <a href="mailto:support@fasify.com" className="text-blue-600 hover:underline">support@fasify.com</a> 
              or call us at +1 (555) 987-6543.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Cancellation policies vary by service provider and booking type</li>
              <li>Some bookings may be non-refundable or have specific cancellation deadlines</li>
              <li>Refunds, when applicable, will be processed within 7-10 business days</li>
              <li>Third-party bookings may have different cancellation procedures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
