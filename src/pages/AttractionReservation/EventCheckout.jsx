import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCreateAttractionBookingMutation } from "../../redux/api/attraction/attractionApi";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { handleError, handleSuccess } from "../../../toast";

export default function EventCheckout() {
  const location = useLocation();
  const [createAttractionBooking] = useCreateAttractionBookingMutation();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user);
  // Accept booking data from multiple shapes
  // - From EventReservationPage.handleBooking: { state: { bookingDetails } }
  // - From EventGuestLogin redirect: { state: { bookingDetails } }
  // - Fallbacks for other shapes reused from security flow
  const raw = location.state || {};
  const bookingDetails =
    raw.bookingDetails ||
    raw.bookingData ||
    raw.payload ||
    raw.data?.data ||
    raw.data ||
    raw.resp?.data ||
    raw.resp ||
    raw.payload?.data ||
    {};
  const guestInfo = location.state?.guestInfo || {};
  const [isProcessing, setIsProcessing] = useState(false);
  console.log("bookingDetails", bookingDetails);
  const unitPrice = Number(bookingDetails?.unitPrice || 0);
  const guestCount = Number(bookingDetails?.guests || 1);
  const total = Number(bookingDetails?.total || unitPrice * guestCount);
  const currencyLabel = bookingDetails?.displayCurrency || "";
  const adultCount = Number(
    bookingDetails?.adults ?? bookingDetails?.guests ?? 1
  );
  const childCount = Number(bookingDetails?.children ?? 0);
  const convertedAdultPrice = Number(
    bookingDetails?.convertedAdultPrice ?? unitPrice
  );
  const convertedChildPrice = Number(
    bookingDetails?.convertedChildPrice ?? convertedAdultPrice
  );

  // Derive guest fields from multiple possible shapes
  const deriveGuest = () => ({
    name:
      guestInfo?.name ||
      guestInfo?.fullName ||
      bookingDetails?.user?.name ||
      bookingDetails?.user?.fullName ||
      user?.name ||
      user?.fullName ||
      "",
    email: guestInfo?.email || bookingDetails?.user?.email || user?.email || "",
    phone:
      guestInfo?.phone ||
      guestInfo?.contactNumber ||
      bookingDetails?.user?.phone ||
      bookingDetails?.user?.contactNumber ||
      user?.phone ||
      user?.contactNumber ||
      "",
    address:
      guestInfo?.address ||
      guestInfo?.country ||
      bookingDetails?.user?.address ||
      bookingDetails?.user?.country ||
      user?.address ||
      user?.country ||
      "",
  });

  const [updatedUser, setUpdatedUser] = useState(deriveGuest());

  // Keep form synced if route state or user changes
  React.useEffect(() => {
    setUpdatedUser(deriveGuest());
  }, [
    JSON.stringify(guestInfo),
    JSON.stringify(bookingDetails?.user),
    JSON.stringify(user),
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReserveConfirm = async () => {
    if (!bookingDetails || !bookingDetails?.bookingId) {
      handleError("Booking information is missing");
      return;
    }

    // Guests coming from EventGuestLogin should now be authenticated
    if (!user) {
      handleError("Please sign in to confirm your booking");
      return;
    }

    const attractionId =
      bookingDetails.appealId || bookingDetails.bookingId || bookingDetails.id;
    if (!attractionId) {
      handleError("Event identifier is missing");
      return;
    }

    setIsProcessing(true);
    try {
      const convertedAdultPrice = Number(
        bookingDetails.convertedAdultPrice ?? bookingDetails.unitPrice ?? 0
      );
      const convertedChildPrice = Number(
        bookingDetails.convertedChildPrice ?? convertedAdultPrice ?? 0
      );
      const adults = Number(
        bookingDetails.adults ?? bookingDetails.guests ?? 1
      );
      const children = Number(bookingDetails.children ?? 0);
      const discountedPrice = Number(
        bookingDetails.discountPercent ?? bookingDetails.discountedPrice ?? 0
      );

      const body = {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        convertedAdultPrice,
        convertedChildPrice,
        displayCurrency: bookingDetails.displayCurrency,
        discountedPrice,
        adults,
        children,
        date: bookingDetails.selectedDate,
        day: bookingDetails.day,
        from: bookingDetails.selectedFrom,
        to: bookingDetails.selectedTo,
      };

      const resp = await createAttractionBooking({
        id: attractionId,
        body,
      }).unwrap();

      const createdBookingId =
        resp?.data?.id || resp?.id || bookingDetails.bookingId;

      handleSuccess("Event reserved successfully!");
      navigate(
        "/event/payment-confirm/" + encodeURIComponent(createdBookingId),
        {
          state: { data: resp },
        }
      );
    } catch (error) {
      const msg =
        error?.data?.message || error?.message || "Failed to create booking";
      handleError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen items-center bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToBooking}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              {/* Guest Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="text-md font-medium mb-3">Guest Information</h3>
                <form className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" /> <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4" /> <span>Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4" /> <span>Phone</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={updatedUser.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4" /> <span>Address</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={updatedUser.address}
                      onChange={handleInputChange}
                      placeholder="Address / Country"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>
                </form>
              </div>

              {/* Event Info */}
              <div className="flex items-start gap-4">
                {bookingDetails?.image && (
                  <img
                    src={bookingDetails.image}
                    alt={bookingDetails.eventName || "Event"}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {bookingDetails.eventName || "Selected Event"}
                    </h3>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {bookingDetails.location}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center space-x-4 mt-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {formatDate(bookingDetails.selectedDate)}
                  </p>
                  <p className="text-gray-600">{bookingDetails.selectedTime}</p>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center space-x-4 mt-4">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {guestCount || 1} {guestCount === 1 ? "guest" : "guests"}
                  </p>
                  <p className="text-gray-600">
                    {`Adults: ${
                      (bookingDetails?.adults ?? guestCount) || 1
                    } | Children: ${bookingDetails?.children ?? 0}`}
                  </p>
                  <p className="text-gray-600">
                    {bookingDetails?.eventName || "Event booking"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Price Summary</h3>

              <div className="text-sm space-y-2">
                {/* Adults line */}
                <div className="flex justify-between">
                  <span>
                    {currencyLabel} {convertedAdultPrice.toFixed(2)} ×{" "}
                    {adultCount} adult
                    {adultCount === 1 ? "" : "s"}
                  </span>
                  <span>
                    {currencyLabel}{" "}
                    {(convertedAdultPrice * adultCount).toFixed(2)}
                  </span>
                </div>

                {/* Children line */}
                {childCount > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {currencyLabel} {convertedChildPrice.toFixed(2)} ×{" "}
                      {childCount} child
                      {childCount === 1 ? "" : "ren"}
                    </span>
                    <span>
                      {currencyLabel}{" "}
                      {(convertedChildPrice * childCount).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3 font-semibold text-lg flex justify-between">
                  <span>Total</span>
                  <span>
                    {currencyLabel} {total.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Taxes and fees included if applicable
                </p>
              </div>

              <button
                onClick={handleReserveConfirm}
                disabled={isProcessing}
                className={`w-full mt-6 py-3 text-white rounded-lg font-medium ${
                  isProcessing
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {isProcessing ? "Processing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
