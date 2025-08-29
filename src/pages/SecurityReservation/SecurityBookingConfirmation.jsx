import React from 'react';
import { CheckCircle, Shield, Calendar, Clock, MapPin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function SecurityBookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get booking data from location state or use default values
    const booking = location.state?.bookingDetails || {
        bookingId: 'SEC' + Math.floor(10000000 + Math.random() * 90000000),
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        serviceType: 'Personal Security',
        total: 500,
        serviceDescription: 'Dedicated protection for individuals'
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateDays = (start, end) => {
        const diffTime = Math.abs(new Date(end) - new Date(start));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-screen py-12 px-5 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
                        <p className="text-blue-100">Your booking ID: {booking.bookingId}</p>
                    </div>

                    <div className=" overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>
                        </div>
                        <div className="px-6 py-5">
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-900">Service Type</h3>
                                        <p className="text-sm text-gray-500">{booking.serviceType}</p>
                                        <p className="mt-1 text-sm text-gray-500">{booking.serviceDescription}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-900">Service Period</h3>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {calculateDays(booking.startDate, booking.endDate)} day{calculateDays(booking.startDate, booking.endDate) > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                                        <p className="text-sm text-gray-500">24/7 Service</p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Your security personnel will be available round the clock during the service period.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-900">Service Location</h3>
                                        <p className="text-sm text-gray-500">
                                            Your specified location
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Our team will contact you to confirm the exact service location details.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">Total Amount</span>
                                <span className="text-xl font-bold text-gray-900">${booking.total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mt-5 px-6 pb-6">
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
        </div>
    );
}
