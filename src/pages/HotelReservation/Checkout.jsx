import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Star } from 'lucide-react';

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingData } = location.state || {};

    const [guestInfo, setGuestInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postcode: '',
        zipCode: ''
    });

    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect if no booking data
    if (!bookingData) {
        navigate('/');
        return null;
    }

    // Add safety check for guests object
    const safeGuests = bookingData.guests || { adults: 1, children: 0, rooms: 1 };

    const handleGuestInfoChange = (field, value) => {
        setGuestInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // const validateForm = () => {
    //     if (!guestInfo.firstName.trim()) {
    //         alert('Please enter your first name');
    //         return false;
    //     }
    //     if (!guestInfo.lastName.trim()) {
    //         alert('Please enter your last name');
    //         return false;
    //     }
    //     if (!guestInfo.email.trim()) {
    //         alert('Please enter your email');
    //         return false;
    //     }
    //     if (!guestInfo.phone.trim()) {
    //         alert('Please enter your phone number');
    //         return false;
    //     }
    //     return true;
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (!validateForm()) {
    //         return;
    //     }

    //     setIsProcessing(true);

    //     navigate('/hotel/payment', {
    //         state: {
    //             bookingData: {
    //                 ...bookingData,
    //                 guestInfo
    //             }
    //         }
    //     });

    //     setIsProcessing(false);
    // };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 ml-4">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Booking Summary */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <h3 className="font-medium text-gray-900">{bookingData.hotelName}</h3>
                                        <p className="text-gray-600">{bookingData.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-gray-900">
                                            {formatDate(bookingData.checkIn)} - {formatDate(bookingData.checkOut)}
                                        </p>
                                        <p className="text-gray-600">{bookingData.nights} nights</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-gray-900">
                                            {safeGuests.adults} {safeGuests.adults !== 1 ? 'adults' : 'adult'}
                                            {safeGuests.children > 0 && `, ${safeGuests.children} ${safeGuests.children !== 1 ? 'children' : 'child'}`}
                                        </p>
                                        <p className="text-gray-600">{safeGuests.rooms} {safeGuests.rooms !== 1 ? 'rooms' : 'room'}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900">{bookingData.roomType}</span>
                                        <span className="text-gray-900">${bookingData.roomPrice}/night</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guest Information Form */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest Information</h2>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestInfo.firstName}
                                            onChange={(e) => handleGuestInfoChange('firstName', e.target.value)}
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
                                            onChange={(e) => handleGuestInfoChange('lastName', e.target.value)}
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
                                        onChange={(e) => handleGuestInfoChange('email', e.target.value)}
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
                                        onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                {/* <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Billing Address
                                    </label>
                                </div> */}

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={guestInfo.street}
                                        onChange={(e) => handleGuestInfoChange('street', e.target.value)}
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
                                        onChange={(e) => handleGuestInfoChange('city', e.target.value)}
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
                                        onChange={(e) => handleGuestInfoChange('postcode', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                        placeholder="Enter your postcode"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country*
                                    </label>
                                    <input
                                        type="text"
                                        value={guestInfo.street}
                                        onChange={(e) => handleGuestInfoChange('street', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                        placeholder="Enter your street address"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar - Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>${bookingData.roomPrice} × {bookingData.nights} nights</span>
                                    <span>${bookingData.subtotal}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span>Service fee</span>
                                    <span>${Math.round(bookingData.subtotal * 0.1)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span>Taxes</span>
                                    <span>${Math.round(bookingData.subtotal * 0.12)}</span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>${bookingData.total}</span>
                                    </div>
                                </div>
                            </div>

                            <Link to="/hotel/payment">
                                <button
                                    type="submit"
                                    // onClick={handleSubmit}
                                    disabled={isProcessing}
                                    className="w-full mt-6 bg-[#0064D2] text-white px-6 py-3 rounded-lg font-semibold"
                                >
                                    {isProcessing ? 'Processing...' : 'Continue to Payment'}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
