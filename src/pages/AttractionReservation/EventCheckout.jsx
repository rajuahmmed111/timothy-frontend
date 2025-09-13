import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Star, Users, CreditCard, ArrowLeft, Clock } from 'lucide-react';

export default function EventCheckout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        postcode: "",
        country: "",
    });

    
    // Get booking details from navigation state
    const bookingDetails = location.state?.bookingDetails || {
        bookingId: 'EVT12345678',
        eventName: 'Burj Khalifa: Floors 124 & 125',
        location: 'Dubai, UAE',
        selectedDate: '2024-03-15',
        selectedTime: '10:00',
        guests: '2',
        total: 1250
    };

    // Calculate additional details
    const basePrice = 600;
    const serviceFee = 50;
    const taxes = Math.round((basePrice * parseInt(bookingDetails.guests)) * 0.08);
    const finalTotal = bookingDetails.total + taxes;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleProceedToPayment = () => {
        setIsProcessing(true);

        // Navigate to payment page with complete booking data
        navigate('/event/payment', {
            state: {
                bookingDetails: {
                    ...bookingDetails,
                    serviceFee,
                    taxes,
                    finalTotal
                }
            }
        });

        setIsProcessing(false);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGuestInfoChange = (field, value) => {
        setGuestInfo((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Event Details
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Event Booking Checkout</h1>
                        <p className="text-gray-600 mt-2">Review your booking details before proceeding to payment</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Booking Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Booking Summary Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center mb-4">
                                    <Star className="w-6 h-6 text-blue-600 mr-3" />
                                    <h2 className="text-xl font-semibold text-gray-900">Booking Summary</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Booking ID */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Booking ID</span>
                                        <span className="font-medium text-gray-900">{bookingDetails.bookingId}</span>
                                    </div>

                                    {/* Event Name */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Event</span>
                                        <span className="font-medium text-gray-900">{bookingDetails.eventName}</span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Location</span>
                                        <span className="font-medium text-gray-900">{bookingDetails.location}</span>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="py-3 border-b border-gray-100">
                                        <div className="flex items-center mb-3">
                                            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                            <span className="text-gray-600">Event Schedule</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Date</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatDate(bookingDetails.selectedDate)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Time</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {bookingDetails.selectedTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guests */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Number of Guests</span>
                                        <span className="font-medium text-gray-900">
                                            {bookingDetails.guests} {parseInt(bookingDetails.guests) === 1 ? 'guest' : 'guests'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Guest Information Form */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Guest
                                </h2>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={guestInfo.firstName}
                                                onChange={(e) =>
                                                    handleGuestInfoChange("firstName", e.target.value)
                                                }
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                                placeholder="Enter your first name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={guestInfo.lastName}
                                                onChange={(e) =>
                                                    handleGuestInfoChange("lastName", e.target.value)
                                                }
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                                placeholder="Enter your last name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={guestInfo.email}
                                            onChange={(e) =>
                                                handleGuestInfoChange("email", e.target.value)
                                            }
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                            placeholder="Enter your email address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={guestInfo.phone}
                                            onChange={(e) =>
                                                handleGuestInfoChange("phone", e.target.value)
                                            }
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestInfo.street}
                                            onChange={(e) =>
                                                handleGuestInfoChange("street", e.target.value)
                                            }
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                            placeholder="Enter your street address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestInfo.city}
                                            onChange={(e) =>
                                                handleGuestInfoChange("city", e.target.value)
                                            }
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                            placeholder="Enter your city"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Postcode *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestInfo.postcode}
                                            onChange={(e) =>
                                                handleGuestInfoChange("postcode", e.target.value)
                                            }
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                            placeholder="Enter your postcode"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestInfo.country}
                                            onChange={(e) =>
                                                handleGuestInfoChange("country", e.target.value)
                                            }
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                            placeholder="Enter your country"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Event Information */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <p>
                                        <strong>Duration:</strong> Approximately 1-2 hours
                                    </p>
                                    <p>
                                        <strong>Meeting Point:</strong> Burj Khalifa Main Entrance
                                    </p>
                                    <p>
                                        <strong>What to Bring:</strong> Valid ID required for entry
                                    </p>
                                    <p>
                                        <strong>Cancellation:</strong> Free cancellation up to 24 hours before the event
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Price Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            $600 × {bookingDetails.guests} {parseInt(bookingDetails.guests) === 1 ? 'guest' : 'guests'}
                                        </span>
                                        <span className="text-gray-900">${600 * parseInt(bookingDetails.guests)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Service fee</span>
                                        <span className="text-gray-900">${serviceFee}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">VAT</span>
                                        <span className="text-gray-900">${taxes}</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-lg font-semibold text-gray-900">${finalTotal}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Proceed to Payment Button */}
                                <button
                                    onClick={handleProceedToPayment}
                                    disabled={isProcessing}
                                    className="w-full mt-6 bg-[#0064D2] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center"
                                >
                                    {isProcessing ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Proceed to Payment
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
