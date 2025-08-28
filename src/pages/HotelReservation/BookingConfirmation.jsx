import React from 'react';
import { CheckCircle, MapPin, Calendar, Users, Clock, CreditCard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get booking data from location state or use default values
    const bookingData = location.state || {
        bookingId: 'BK' + Math.floor(10000000 + Math.random() * 90000000),
        hotelName: 'Luxury Beach Resort & Spa',
        location: 'Maldives',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: 2,
        roomType: 'Deluxe Room',
        total: 3500,
        bookingDate: new Date().toISOString().split('T')[0]
    };

    // Calculate nights from check-in and check-out dates
    const nights = Math.ceil(
        (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24)
    );

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
                        <p className="text-blue-100">Your booking ID: {bookingData.bookingId}</p>
                    </div>

                    {/* Booking Summary */}
                    <div className="p-6 md:p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{bookingData.hotelName}</h2>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-5 h-5 mr-2 text-sky-600" />
                                    <span>{bookingData.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-5 h-5 mr-2 text-sky-600" />
                                    <span>
                                        {formatDate(bookingData.checkIn)} - {formatDate(bookingData.checkOut)}
                                        <span className="mx-2">•</span>
                                        {nights} {nights === 1 ? 'night' : 'nights'}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Users className="w-5 h-5 mr-2 text-sky-600" />
                                    <span>{bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-b border-gray-200 py-6 my-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Room Type</p>
                                    <p className="font-medium">{bookingData.roomType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Booking Date</p>
                                    <p className="font-medium">{formatDate(bookingData.bookingDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-xl font-bold text-sky-700">{formatCurrency(bookingData.total)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="font-medium flex items-center">
                                        <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                                        {bookingData.paymentMethod || 'Credit card (ending in 4242)'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* <div className="bg-blue-50 p-4 rounded-lg mb-8">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">Check-in Information</h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <p>Please arrive after 3:00 PM. Early check-in is subject to availability.</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        <div className="space-y-3">
                            <div className="w-full">
                                <Link
                                    to="/"
                                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                                >
                                    Back to Home
                                </Link>
                            </div>
                            <button
                                type="button"
                                className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                                onClick={() => window.print()}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Confirmation
                            </button>
                        </div>
                    </div>
                </div>

                {/* <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Need help? Contact our customer support at support@fasify.com or call +1 (555) 123-4567</p>
                </div> */}
            </div>
        </div>
    );
}
