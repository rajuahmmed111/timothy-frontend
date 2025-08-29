import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, CreditCard, Download, Home, Users } from 'lucide-react';

export default function EventBookingConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingDetails } = location.state || {};

    const handleDownloadReceipt = () => {
        // In a real app, this would generate and download a PDF receipt
        console.log('Downloading receipt for booking:', bookingDetails?.bookingId);
        alert('Receipt download functionality would be implemented here');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleBookAnother = () => {
        navigate('/attraction-reservation');
    };

    if (!bookingDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No booking details found</h2>
                    <p className="text-gray-600 mb-4">Please try booking again</p>
                    <button
                        onClick={handleBackToHome}
                        className="bg-[#0064D2] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-green-50 p-6 text-center border-b border-green-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                        <p className="text-gray-600">Your event reservation has been successfully booked</p>
                    </div>

                    {/* Booking Details */}
                    <div className="p-6 md:p-8">
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start space-x-3 mb-4">
                                    <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{bookingDetails.eventName || 'Burj Khalifa: Floors 124 & 125'}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span>{bookingDetails.location || 'Dubai, UAE'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Booking ID:</span>
                                            <span className="font-medium">{bookingDetails.bookingId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Event Date:</span>
                                            <span>{bookingDetails.selectedDate ? new Date(bookingDetails.selectedDate).toLocaleDateString() : 'Selected Date'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Event Time:</span>
                                            <span>{bookingDetails.selectedTime || 'Selected Time'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Guests:</span>
                                            <span className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {bookingDetails.guests || 1} guest{(bookingDetails.guests || 1) > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Status:</span>
                                            <span className="text-green-600 font-medium">Paid</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Method:</span>
                                            <span>{bookingDetails.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between font-medium pt-4 mt-4 border-t border-gray-200">
                                    <span>Total Paid:</span>
                                    <span className="text-lg text-green-600">${bookingDetails.total || 650}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleDownloadReceipt}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download Receipt
                            </button>

                            <div className="w-full">

                                <button
                                    onClick={handleBackToHome}
                                    className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                                >
                                    <Home className="w-5 h-5 mr-2" />
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
