import React from 'react';
import { Calendar, Users, MapPin, Check, Mail, Phone, CreditCard, Download, Share2 } from 'lucide-react';


export default function ReservationDetails({ bookingData }) {
    const booking = bookingData || {
        confirmationNumber: 'AO-2024-789456',
        checkIn: '2024-03-15',
        checkOut: '2024-03-18',
        guests: 2,
        roomType: 'Deluxe Room',
        roomPrice: 500,
        nights: 3,
        subtotal: 1500,
        serviceFee: 150,
        taxes: 180,
        total: 1830,
        guestInfo: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1 (555) 123-4567'
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const handleDownloadConfirmation = () => {
        alert('Confirmation PDF downloaded successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-5 lg:px-0 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed</h1>
                            <div className="flex items-center mt-2 text-gray-600">
                                <Check className="w-5 h-5 mr-2 text-green-500" />
                                <span>Your reservation has been confirmed</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleDownloadConfirmation}
                                className="flex items-center px-4 py-2 text-white bg-[#0064D2] rounded-lg transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-5 lg:px-0 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Confirmation Details */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Confirmation Details</h2>
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Confirmed
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Confirmation Number</label>
                                    <div className="text-lg font-mono font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {booking.confirmationNumber}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Booking Date</label>
                                    <div className="text-lg text-gray-900">
                                        {new Date().toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stay Details */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Stay Details</h2>

                            <div className="space-y-6">
                                {/* Property Info */}
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 bg-sky-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-sky-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Azure Oasis Resort</h3>
                                        <p className="text-gray-600">Riviera Resort, Pristine Thailand</p>
                                        <p className="text-sm text-gray-500 mt-1">5-star luxury resort with ocean views</p>
                                    </div>
                                </div>

                                {/* Dates and Duration */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Check-in</div>
                                            <div className="text-gray-900">{formatDate(booking.checkIn)}</div>
                                            <div className="text-sm text-gray-500">After 3:00 PM</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Check-out</div>
                                            <div className="text-gray-900">{formatDate(booking.checkOut)}</div>
                                            <div className="text-sm text-gray-500">Before 11:00 AM</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Users className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Guests</div>
                                            <div className="text-gray-900">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</div>
                                            <div className="text-sm text-gray-500">{booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Room Details */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">{booking.roomType}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Room Type:</span>
                                            <div className="font-medium">{booking.roomType}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Rate:</span>
                                            <div className="font-medium">${booking.roomPrice}/night</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Nights:</span>
                                            <div className="font-medium">{booking.nights}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Guests:</span>
                                            <div className="font-medium">{booking.guests}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guest Information */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Primary Guest</label>
                                    <div className="text-lg text-gray-900">
                                        {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Number of Guests</label>
                                    <div className="text-lg text-gray-900">{booking.guests}</div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Email</label>
                                        <div className="text-gray-900">{booking.guestInfo.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Phone</label>
                                        <div className="text-gray-900">{booking.guestInfo.phone}</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Price Breakdown */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Price Breakdown</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">${booking.roomPrice} × {booking.nights} nights</span>
                                    <span className="text-gray-900">${booking.subtotal}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service fee</span>
                                    <span className="text-gray-900">${booking.serviceFee}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">VAT</span>
                                    <span className="text-gray-900">${booking.taxes}</span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-gray-900">${booking.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mt-6 pt-6 border-t">
                                <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-900">•••• •••• •••• 4242</div>
                                        <div className="text-xs text-gray-500">Visa ending in 4242</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
