import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  CreditCard,
  MapPin,
  Users,
  Wallet,
  ShieldCheck,
  ArrowLeft,
  Phone,
} from "lucide-react";

export default function PaymentConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const bookingDetails = location.state?.bookingDetails;
  console.log("dsfd", bookingDetails);

  const calculateTotal = () => {
    const price = Number(bookingDetails?.roomPrice) * Number(bookingDetails?.rooms) || 0;
    const subtotal = price;
    const vatAmount = Math.round((subtotal * (bookingDetails?.vat || 0)) / 100);
    const total = subtotal + vatAmount;
    
    return {
      subtotal,
      vatAmount,
      total,
    };
  };

  const { subtotal, vatAmount, total } = calculateTotal();
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Handle payment processing here
      // await processPayment({ ...bookingDetails, paymentMethod });
      // navigate('/booking-confirmation');
      console.log("Processing payment...");
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to previous page
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:flex gap-8">
            {/* Left Column - Booking Details */}
            <div className="md:w-2/3 space-y-6">
              <div className="pb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      {bookingDetails?.hotelName || 'Hotel Name Not Available'}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <p className="text-sm">{bookingDetails?.location || 'Location not specified'}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {bookingDetails?.roomType && `Room Type: ${bookingDetails.roomType}`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p>{formatDate(bookingDetails?.checkIn) || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p>{formatDate(bookingDetails?.checkOut) || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Nights</p>
                        <p>{bookingDetails?.nights || '1'} night{bookingDetails?.nights !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p>
                          {bookingDetails?.adults || 1} {bookingDetails?.adults === 1 ? 'Adult' : 'Adults'}
                          {bookingDetails?.children ? `, ${bookingDetails.children} ${bookingDetails.children === 1 ? 'Child' : 'Children'}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ShieldCheck className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Condition</p>
                        <p
                          className={
                            bookingDetails?.isRefundable
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {bookingDetails?.isRefundable
                            ? "Refundable"
                            : "Non-Refundable"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number: </p>
                        <p> {bookingDetails?.phoneNumber || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="md:w-1/3 mt-10 md:mt-0">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-6">
                <h2 className="text-lg font-semibold mb-8">Price Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per night</span>
                    <span>${(bookingDetails?.roomPrice || 0).toLocaleString()}</span>
                  </div>
               
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT ({bookingDetails?.vat || 0}%)</span>
                    <span>${(vatAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${(total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-70"
                  >
                    {isLoading ? "Processing..." : "Continue to Pay"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
