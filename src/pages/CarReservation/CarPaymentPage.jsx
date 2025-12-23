import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// Import the payment mutations from your API slice
import {
  useCreateCarPaystackSessionMutation,
  useCreateCarStripeSessionMutation,
  useCreateCarBookingMutation,
} from "../../redux/api/car/carApi";

// Helper function to check if a country is in Africa
const isAfricanCountry = (country) => {
  if (!country) return false;
  const africanCountries = [
    "nigeria",
    "ghana",
    "kenya",
    "south africa",
    "algeria",
    "angola",
    "benin",
    "botswana",
    "burkina faso",
    "burundi",
    "cameroon",
    "cape verde",
    "central african republic",
    "chad",
    "comoros",
    "congo",
    "democratic republic of the congo",
    "cote d'ivoire",
    "ivory coast",
    "djibouti",
    "egypt",
    "equatorial guinea",
    "eritrea",
    "eswatini",
    "ethiopia",
    "gabon",
    "gambia",
    "ghana",
    "guinea",
    "guinea-bissau",
    "kenya",
    "lesotho",
    "liberia",
    "libya",
    "madagascar",
    "malawi",
    "mali",
    "mauritania",
    "mauritius",
    "morocco",
    "mozambique",
    "namibia",
    "niger",
    "nigeria",
    "rwanda",
    "sao tome and principe",
    "senegal",
    "seychelles",
    "sierra leone",
    "somalia",
    "south africa",
    "south sudan",
    "sudan",
    "tanzania",
    "togo",
    "tunisia",
    "uganda",
    "zambia",
    "zimbabwe",
  ];
  return africanCountries.includes(country.toLowerCase().trim());
};

import {
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  ArrowLeft,
  Phone,
} from "lucide-react";

export default function PaymentConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [modalTimer, setModalTimer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const bookingDetails =
    location.state?.bookingDetails ||
    location.state?.bookingData ||
    location.state?.data ||
    null;

  const carCancelationPolicy = location.state?.carCancelationPolicy;
  useEffect(() => {
    // Check both country and address fields for country data
    const userCountry =
      bookingDetails?.user?.country || bookingDetails?.user?.address;

    if (userCountry) {
      const country = userCountry.toLowerCase();
      const isUserInAfrica = isAfricanCountry(country);
      const selectedMethod = isUserInAfrica ? "paystack" : "stripe";
      setPaymentMethod(selectedMethod);
    } else {
      setPaymentMethod("stripe");
    }
  }, [bookingDetails?.user?.country, bookingDetails?.user?.address]);

  // Payment mutations
  const [createPaystackSession] = useCreateCarPaystackSessionMutation();
  const [createStripeSession] = useCreateCarStripeSessionMutation();
  const [createCarBooking] = useCreateCarBookingMutation();

  // Derive base amount and VAT so UI clearly shows tax breakdown
  const days = useMemo(
    () => Number(bookingDetails?.days || 1),
    [bookingDetails]
  );

  const unitPrice = useMemo(
    () => Number(bookingDetails?.unitPrice || 0),
    [bookingDetails]
  );

  const baseTotal = useMemo(() => unitPrice * days, [unitPrice, days]);

  const vatAmount = useMemo(
    () => Number((baseTotal * 0.05).toFixed(2)),
    [baseTotal]
  );

  const total = useMemo(
    () => Number((baseTotal + vatAmount).toFixed(2)),
    [baseTotal, vatAmount]
  );

  const userInfo = location.state?.userInfo;

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  // Get booking ID from URL params or state
  const searchParams = new URLSearchParams(location.search);

  // Get booking ID from multiple sources with fallback
  const bookingId = (() => {
    // Try URL parameters first
    const fromUrl = searchParams.get("bookingId");
    if (fromUrl) return fromUrl;

    // Then try location state
    if (location.state?.createdBookingId) {
      return location.state.createdBookingId;
    }

    // Then try booking details
    if (bookingDetails?.id) {
      return bookingDetails.id.toString();
    }

    // If we have a booking reference in the URL path
    const pathParts = window.location.pathname.split("/");
    const possibleId = pathParts[pathParts.length - 1];
    if (possibleId && possibleId.length > 10) {
      // Simple validation for ID length
      return possibleId;
    }

    return null;
  })();

  const handlePayment = async () => {
    if (!total || total <= 0) {
      toast.error("Invalid total amount");
      return;
    }

    setIsLoading(true);

    try {
      // Create booking first
      const bookingPayload = {
        name:
          bookingDetails?.user?.name || bookingDetails?.user?.fullName || "",
        email: bookingDetails?.user?.email || "",
        phone:
          bookingDetails?.user?.phone ||
          bookingDetails?.user?.contactNo ||
          bookingDetails?.user?.contactNumber ||
          "",
        contactNo:
          bookingDetails?.user?.phone ||
          bookingDetails?.user?.contactNo ||
          bookingDetails?.user?.contactNumber ||
          "",
        address: bookingDetails?.user?.address || "",
        country: bookingDetails?.user?.country || "",

        // Price information
        convertedPrice: unitPrice,
        totalPrice: unitPrice,
        displayCurrency: bookingDetails?.currency || "USD",
        discountedPrice: bookingDetails?.discountedPrice || 0,

        // Booking information
        carBookedFromDate: bookingDetails?.pickupDate,
        carBookedToDate: bookingDetails?.returnDate,
        currency: bookingDetails?.currency || "USD",
        location: bookingDetails?.location,
        carName: bookingDetails?.carName,
        carSeats: bookingDetails?.carSeats,
        carCancelationPolicy: bookingDetails?.carCancelationPolicy,
        days: days,
        guests: bookingDetails?.guests || 1,
        unitPrice: unitPrice,
        description: bookingDetails?.carDescription,

        // User reference
        userId: bookingDetails?.user?.id,
        user: bookingDetails?.user,

        // Currency conversion
        userCurrency: bookingDetails?.userCurrency,
        userCountry: bookingDetails?.userCountry,
        conversionRate: bookingDetails?.conversionRate,
        baseCurrency:
          bookingDetails?.baseCurrency || bookingDetails?.currency || "USD",
        baseAdultPrice: bookingDetails?.basePrice || bookingDetails?.unitPrice,
      };

      const response = await createCarBooking({
        carId: bookingDetails?.carId,
        data: bookingPayload,
      }).unwrap();

      const bookingId =
        response?.data?.bookingId ||
        response?.data?._id ||
        response?.data?.id ||
        response?.bookingId ||
        null;

      if (!bookingId) throw new Error("Booking reference missing from server.");

      // Show success toast and go directly to payment
      toast.success("Car booking created successfully!");
      proceedToPayment(bookingId);
    } catch (error) {
      // Check for specific car already booked error
      const errorMessage =
        error?.data?.message || error?.message || "Failed to create booking";

      if (
        errorMessage.includes("already booked") ||
        errorMessage.includes(
          "This car is already booked for the selected dates"
        )
      ) {
        alert(
          "This car is already booked for the selected dates. Please choose different dates or another car."
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToPayment = async (bookingId) => {
    try {
      const successUrl = `${window.location.origin}/booking-confirmation`;
      const cancelUrl = `${window.location.origin}/booking-cancellation`;

      if (paymentMethod === "paystack") {
        const response = await createPaystackSession(bookingId).unwrap();

        const checkoutUrl =
          response?.data?.checkoutUrl ||
          response?.checkoutUrl ||
          response?.data?.authorization_url ||
          response?.authorization_url;

        if (!checkoutUrl) {
          throw new Error("No valid checkout URL found in Paystack response");
        }

        window.location.href = checkoutUrl;
      } else {
        const response = await createStripeSession(bookingId).unwrap();

        const checkoutUrl =
          response?.data?.checkoutUrl ||
          response?.checkoutUrl ||
          response?.data?.url ||
          response?.url;

        if (!checkoutUrl) {
          throw new Error("No valid checkout URL found in Stripe response");
        }

        window.location.href = checkoutUrl;
      }
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Payment failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-xl text-[#000] font-bold my-5"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Booking Details
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:flex gap-8">
            {/* Left Column - Booking Details */}
            <div className="md:w-2/3 space-y-6">
              <div className="pb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      Car Model: {bookingDetails?.carName || "N/A"}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        Location: {bookingDetails?.location || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 flex  gap-20">
                    <div className="shadow-sm p-4 border border-gray-200 h-[240px] w-[300px] rounded-lg">
                      <div className="flex gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Pickup Date</p>
                          <p>
                            {formatDate(bookingDetails.pickupDate) ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Return Date</p>
                          <p>
                            {formatDate(bookingDetails.returnDate) ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Days</p>
                          <p>
                            {bookingDetails.days || "1"} day
                            {bookingDetails.days !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="shadow-sm p-4 border border-gray-200 h-[240px] w-[300px] rounded-lg">
                      <div className="flex gap-2 items-center">
                        <Users className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Seats</p>
                          <p>{bookingDetails?.carSeats || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <ShieldCheck className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Booking Condition
                          </p>
                          <p
                            className={
                              bookingDetails?.carCancelationPolicy
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {bookingDetails?.carCancelationPolicy
                              ? "Refundable"
                              : "Non Refundable "}
                          </p>
                          <span className="text-md">
                            {bookingDetails?.carCancelationPolicy || ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Phone className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Country: </p>
                          <p>{bookingDetails?.user?.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="md:w-1/3 mt-10 md:mt-0">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 sticky top-6 p-6">
                <h2 className="text-lg font-semibold mb-6">Price Details</h2>

                <div className="space-y-4">
                  {/* Daily Rate */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Daily Rate × {days} days
                    </span>
                    <span>
                      {bookingDetails?.currency} {baseTotal + vatAmount}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>
                        {bookingDetails?.currency} {total}
                      </span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="mt-6">
                    <button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-70"
                    >
                      {isLoading ? "Processing..." : "Continue And Pay"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
