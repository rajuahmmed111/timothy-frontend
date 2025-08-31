import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Shield, User, MapPin, Clock, CreditCard, ArrowLeft } from 'lucide-react';

export default function SecurityCheckout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // Get booking details from navigation state
    const bookingDetails = location.state?.bookingDetails || {
        bookingId: 'SEC12345678',
        startDate: '2024-03-15',
        endDate: '2024-03-18',
        serviceType: 'Personal Security',
        total: 1500,
        serviceDescription: 'Dedicated protection for individuals'
    };

    // Calculate additional details
    const days = Math.ceil((new Date(bookingDetails.endDate) - new Date(bookingDetails.startDate)) / (1000 * 60 * 60 * 24)) || 1;
    const servicePrice = bookingDetails.total / days;
    const serviceFee = Math.round(bookingDetails.total * 0.1);
    const taxes = Math.round(bookingDetails.total * 0.08);
    const finalTotal = bookingDetails.total + serviceFee + taxes;

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
        navigate('/security/payment', {
            state: {
                bookingDetails: {
                    ...bookingDetails,
                    serviceFee,
                    taxes,
                    finalTotal,
                    days
                }
            }
        });

        setIsProcessing(false);
    };

    const handleGoBack = () => {
        navigate(-1);
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
                            Back to Service Details
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Security Service Checkout</h1>
                        <p className="text-gray-600 mt-2">Review your booking details before proceeding to payment</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Booking Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Booking Summary Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center mb-4">
                                    <Shield className="w-6 h-6 text-blue-600 mr-3" />
                                    <h2 className="text-xl font-semibold text-gray-900">Booking Summary</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Booking ID */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Booking ID</span>
                                        <span className="font-medium text-gray-900">{bookingDetails.bookingId}</span>
                                    </div>

                                    {/* Service Type */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Service Type</span>
                                        <span className="font-medium text-gray-900">{bookingDetails.serviceType}</span>
                                    </div>

                                    {/* Service Description */}
                                    <div className="py-3 border-b border-gray-100">
                                        <span className="text-gray-600 block mb-2">Service Description</span>
                                        <span className="text-gray-900">{bookingDetails.serviceDescription}</span>
                                    </div>

                                    {/* Dates */}
                                    <div className="py-3 border-b border-gray-100">
                                        <div className="flex items-center mb-3">
                                            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                            <span className="text-gray-600">Service Period</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Start Date</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatDate(bookingDetails.startDate)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">End Date</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatDate(bookingDetails.endDate)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-gray-100">
                                                <span className="text-sm text-gray-500">Duration</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {days} {days === 1 ? 'day' : 'days'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
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
                                            ${servicePrice} × {days} {days === 1 ? 'day' : 'days'}
                                        </span>
                                        <span className="text-gray-900">${bookingDetails.total}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Service fee</span>
                                        <span className="text-gray-900">${serviceFee}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Taxes & fees</span>
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
