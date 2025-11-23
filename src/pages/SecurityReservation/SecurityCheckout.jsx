import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useCreateSecurityBookingMutation } from "../../redux/api/security/securityBookingApi";
import { handleError, handleSuccess } from "../../../toast";

export default function SecurityCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  // Accept booking data from multiple shapes
  // - From SecurityBookingForm when logged-in: { state: { payload } }
  // - From SecurityGuestLogin redirect: { state: { bookingData } }
  // - From other flows: { state: { data|resp|payload } } possibly wrapped with .data
  const raw = location.state || {};
  const bookingDetails =
    raw.payload ||
    raw.bookingData ||
    raw.data?.data ||
    raw.data ||
    raw.resp?.data ||
    raw.resp ||
    raw.payload?.data ||
    {};
  const guestInfo = location.state?.guestInfo || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const cancelationPolicy = bookingDetails?.cancelationPolicy || null;
  const [createSecurityBooking, { isLoading }] =
    useCreateSecurityBookingMutation();

  // Days between start and end dates
  const days = (() => {
    const start = bookingDetails?.startDate
      ? new Date(bookingDetails.startDate)
      : null;
    const end = bookingDetails?.endDate
      ? new Date(bookingDetails.endDate)
      : null;
    if (!start || !end) return 1;
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 1;
  })();
  const currencyCode = bookingDetails?.currency ;
  const unitPrice = Number(bookingDetails?.pricePerDay || 0);
  const personnelCount = Number(bookingDetails?.personnelCount || 1);
  const subtotal = unitPrice * days * personnelCount;
  const vatRate = 5;
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

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
    if (!bookingDetails?.guardId) {
      handleError("Guard information is missing");
      return;
    }
    if (!user) return;

    setIsProcessing(true);

    try {
      // Build body as API expects for security booking
      const total =
        bookingDetails?.total ||
        Number(bookingDetails?.pricePerDay || 0) *
          days *
          Number(bookingDetails?.personnelCount || 1);
      const body = {
        // Core booking fields (prefer explicit fields from page, fallback to existing)
        number_of_security:
          bookingDetails?.number_of_security ??
          bookingDetails?.personnelCount ??
          1,
        securityBookedFromDate:
          bookingDetails?.securityBookedFromDate || bookingDetails?.startDate,
        securityBookedToDate:
          bookingDetails?.securityBookedToDate || bookingDetails?.endDate,
        totalPrice: total,
        convertedPrice: bookingDetails?.convertedPrice ?? total,
        displayCurrency:
          bookingDetails?.displayCurrency ||
          bookingDetails?.currency ||
          currencyCode,
        discountedPrice: bookingDetails?.discountedPrice ?? 0,
        cancelationPolicy,
        // Identification
        guardId: bookingDetails?.guardId,
        guardName: bookingDetails?.guardName,
        serviceType: bookingDetails?.serviceType || "Security",
        serviceDescription: bookingDetails?.serviceDescription,
        pricePerDay: bookingDetails?.pricePerDay,

        // User contact details from form
        name: updatedUser?.name || "",
        email: updatedUser?.email || "",
        phone: updatedUser?.phone || "",
        address: updatedUser?.address || "",

        // Status flags
        status: "pending",
        paymentStatus: "pending",
      };

      console.log("Creating security booking with:", {
        id: bookingDetails?.guardId,
        body,
      });
      const resp = await createSecurityBooking({
        id: bookingDetails?.guardId,
        body,
      }).unwrap();
      console.log("createSecurityBooking resp:", resp);

      handleSuccess("Security service reserved successfully!");
      const createdBookingId = resp?.data?.id || resp?.id || "";

      navigate(
        `/security/payment-confirm?bookingId=${encodeURIComponent(
          createdBookingId
        )}`,
        {
          state: { data: resp, cancelationPolicy },
          replace: true,
        }
      );
    } catch (e) {
      const msg =
        e?.data?.message || e?.message || "Failed to create security booking";
      handleError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    navigate("/security-details");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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
                      <MapPin className="w-4 h-4" /> <span>Country</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={updatedUser.address}
                      readOnly
                      placeholder="Address / Country"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm outline-none p-2 border"
                    />
                  </div>
                </form>
              </div>

              {/* Selected Guard Info */}
              <div className="flex items-start gap-4">
                {bookingDetails?.photo && (
                  <img
                    src={bookingDetails.photo}
                    alt={bookingDetails.guardName || "Guard"}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {bookingDetails.guardName || "Selected Guard"}
                    </h3>
                    {bookingDetails?.serviceType && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs">
                        {bookingDetails.serviceType}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">
                    {currencyCode} {unitPrice} / day
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center space-x-4 mt-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {formatDate(bookingDetails.startDate)} -{" "}
                    {formatDate(bookingDetails.endDate)}
                  </p>
                  <p className="text-gray-600">
                    {days} {days === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center space-x-4 mt-4">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {bookingDetails?.personnelCount || 1}{" "}
                    {Number(bookingDetails?.personnelCount || 1) === 1
                      ? "guard"
                      : "guards"}
                  </p>
                  <p className="text-gray-600">
                    {bookingDetails?.serviceDescription || "Security service"}
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
                <div className="flex justify-between">
                  <span>
                    {currencyCode} {unitPrice} × {days}{" "}
                    {days === 1 ? "day" : "days"} × {personnelCount}{" "}
                    {personnelCount === 1 ? "guard" : "guards"}
                  </span>
                  <span>
                    {currencyCode} {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT ({vatRate}%)</span>
                  <span>
                    {currencyCode} {vatAmount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3 font-semibold text-lg flex justify-between">
                  <span>Total</span>
                  <span>
                    {currencyCode} {total.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Taxes and fees included if applicable
                </p>
              </div>

              <button
                onClick={handleReserveConfirm}
                disabled={isProcessing || isLoading}
                className={`w-full mt-6 py-3 text-white rounded-lg font-medium ${
                  isProcessing || isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {isProcessing || isLoading ? "Processing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
