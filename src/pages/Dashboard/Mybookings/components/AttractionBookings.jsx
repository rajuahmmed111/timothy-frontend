import React from 'react';
import { useGetAllAttractionBookingQuery } from '../../../../redux/api/userDashboard/myBooking';
import Loader from '../../../../shared/Loader/Loader';

export default function AttractionBookings() {
  const { data: attractionBooking, isLoading } = useGetAllAttractionBookingQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  let bookingArray = [];

  if (Array.isArray(attractionBooking)) {
    bookingArray = attractionBooking;
  } else if (Array.isArray(attractionBooking?.data)) {
    bookingArray = attractionBooking.data;
  } else if (Array.isArray(attractionBooking?.data?.results)) {
    bookingArray = attractionBooking.data.results;
  } else if (attractionBooking?.data) {
    bookingArray = [attractionBooking.data];
  }

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      {bookingArray.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You have no attraction bookings yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#3b82f6] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Attraction</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Time Slot</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Adults</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Children</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Booking Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookingArray.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {booking?.attraction?.businessLogo ? (
                        <img
                          src={booking.attraction.businessLogo}
                          alt={booking?.attraction?.attractionName || 'Attraction'}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                          🎢
                        </div>
                      )}
                      <span className="font-medium text-gray-800">
                        {booking?.attraction?.attractionName ?? 'Unnamed Attraction'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking?.appeal?.attractionAddress ?? ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking?.date ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking?.timeSlot
                      ? `${booking.timeSlot.from ?? 'N/A'} - ${booking.timeSlot.to ?? 'N/A'}`
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{booking?.adults ?? 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{booking?.children ?? 0}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    ${booking?.totalPrice ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold inline-block ${
                        booking?.bookingStatus === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : booking?.bookingStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {booking?.bookingStatus ?? 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold inline-block ${
                        booking?.payment?.[0]?.status === 'PAID'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {booking?.payment?.[0]?.status ?? 'UNPAID'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
