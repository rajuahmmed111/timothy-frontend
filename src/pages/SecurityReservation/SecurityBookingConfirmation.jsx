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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Booking Confirmed!
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Your security service has been successfully booked.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Booking ID: <span className="font-medium">{booking.bookingId}</span>
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
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
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">Total Amount</span>
                            <span className="text-xl font-bold text-gray-900">${booking.total}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">What's Next?</h2>
                    </div>
                    <div className="px-6 py-5">
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="ml-3 text-sm text-gray-700">
                                    You'll receive a confirmation email with your booking details shortly.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="ml-3 text-sm text-gray-700">
                                    Our security team will contact you within 24 hours to discuss your specific requirements.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="ml-3 text-sm text-gray-700">
                                    For any questions or changes to your booking, please contact our support team.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Back to Home
                    </button>
                    <Link
                        to="/security-reservation"
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
                    >
                        Book Another Service
                    </Link>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Need help?{' '}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Contact our support team
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
