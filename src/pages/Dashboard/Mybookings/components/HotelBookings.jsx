import React from "react";
import {
  useGetAllHotelBookingQuery,
  useCancelHotelBookingMutation,
} from "../../../../redux/api/userDashboard/myBooking";
import Loader from "../../../../shared/Loader/Loader";

export default function HotelBookings() {
  const { data: hotelBooking, isLoading } = useGetAllHotelBookingQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [cancelHotelBooking, { isLoading: isCancelling }] =
    useCancelHotelBookingMutation();

  const handleCancel = async (id) => {
    try {
      await cancelHotelBooking({ id }).unwrap();
    } catch (e) {}
  };

  console.log("hotelBooking:", hotelBooking);

  let bookingArray = hotelBooking?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      {bookingArray.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You have no hotel bookings yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#3b82f6] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Hotel
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  From Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  To Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Rooms
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Booking Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookingArray.map((booking, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {booking?.hotel?.businessLogo ? (
                        <img
                          src={booking.hotel.businessLogo}
                          alt={booking?.hotel?.hotelName || "Hotel"}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                          🏨
                        </div>
                      )}
                      <span className="font-medium text-gray-800">
                        {booking?.hotel?.hotelName ?? "Unnamed Hotel"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking?.hotel?.hotelCity ?? ""},{" "}
                    {booking?.hotel?.hotelCountry ?? ""}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking?.bookedFromDate ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking?.bookedToDate ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking?.rooms ?? 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {booking?.room?.hotelRoomType ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    ${booking?.totalPrice ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold inline-block ${
                        booking?.bookingStatus === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : booking?.bookingStatus === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking?.bookingStatus ?? "PENDING"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold inline-block ${
                        booking?.payment?.[0]?.status === "PAID"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking?.payment?.[0]?.status ?? "UNPAID"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span>{booking?.payment?.[0]?.provider ?? "N/A"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleCancel(booking?.id)}
                      disabled={
                        isCancelling || booking?.bookingStatus === "CANCELLED"
                      }
                      className={`text-xs px-3 py-1 rounded border transition ${
                        booking?.bookingStatus === "CANCELLED"
                          ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      }`}
                    >
                      Cancel
                    </button>
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
