import React, { useState } from 'react';
import { CheckCircle, MapPin, Calendar, Users, Clock, CreditCard, Phone, Mail, Wifi, Car, Coffee, Utensils, Waves } from 'lucide-react';
import { Link, useLocation, } from 'react-router-dom';

export default function BookingConfirmation() {
    const location = useLocation();
    // const navigate = useNavigate();
    const [isEmailSending, setIsEmailSending] = useState(false);
    
    // Get booking data from location state or use default values
    const bookingData = location.state || {
        bookingId: 'BK' + Math.floor(10000000 + Math.random() * 90000000),
        hotelName: 'Azure Oasis',
        location: 'Riviera Resort, Pristine Thailand',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: 1,
        roomType: 'Deluxe Room',
        total: 4000,
        bookingDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Card ending in 4242',
        rating: 4.8
    };
    

    // Hotel details
    const hotelDetails = {
        address: 'Riviera Resort, Pristine Thailand',
        phone: '+66 2-123-4567',
        email: 'reservations@azureoasis.com',
        checkInTime: '3:00 PM',
        checkOutTime: '12:00 PM',
        description: 'Nestled along the pristine shores of Thailand\'s Riviera, Azure Oasis offers an unparalleled luxury experience. Our Mediterranean-inspired architecture blends seamlessly with tropical surroundings, creating an oasis of tranquility and sophistication. Each room is thoughtfully designed with modern amenities and stunning ocean views.',
        amenities: [
            { icon: Wifi, name: 'Free WiFi' },
            { icon: Car, name: 'Free Parking' },
            { icon: Coffee, name: 'Coffee Bar' },
            { icon: Waves, name: 'Swimming Pool' },
            { icon: Utensils, name: 'Restaurant' }
        ],
        roomFeatures: [
            'Ocean View',
            'King Bed',
            'Mini Bar',
            'Mediterranean-inspired design',
            'Modern amenities',
            'Stunning ocean views'
        ],
        reviews: [
            {
                name: 'Sarah Johnson',
                date: 'March 2024',
                comment: 'Absolutely stunning property! The ocean views were breathtaking and the staff went above and beyond to make our stay memorable. The facilities were top-notch and the room was immaculate.'
            },
            {
                name: 'Michael Chen',
                date: 'February 2024',
                comment: 'Great location and beautiful architecture. The swimming pool area was fantastic and the restaurant served excellent food. Only minor issue was the WiFi speed in some areas.'
            },
            {
                name: 'Emma Rodriguez',
                date: 'January 2024',
                comment: 'Perfect honeymoon destination! The Mediterranean-inspired design is beautiful and the sunset views from our balcony were unforgettable. Highly recommend the spa services.'
            }
        ]
    };

    // Handle send to email functionality
    const handleSendToEmail = async () => {
        setIsEmailSending(true);
        
        try {
            // Simulate API call to send email
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In a real application, you would make an API call here
            // const response = await fetch('/api/send-confirmation-email', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ bookingData, guestDetails })
            // });
            
            alert('Booking confirmation has been sent to your email!');
        } catch (error) {
            alert('Failed to send email. Please try again.');
        } finally {
            setIsEmailSending(false);
        }
    };

    // Guest details (dummy data)
    const guestDetails = {
        primaryGuest: {
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1 (555) 123-4567'
        },
        specialRequests: 'Late check-in, Ocean view preferred',
        additionalNotes: 'Celebrating anniversary'
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

                    {/* Hotel Information */}
                    <div className="p-6 md:p-8">
                        <div className="mb-8">
                            {/* <p className='text-gray-600 mb-4 font-semibold text-lg'>Thanks for booking timothy</p> */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{bookingData.hotelName}</h2>
                            <p className="text-gray-600 mb-4">{hotelDetails.description}</p>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-5 h-5 mr-2 text-sky-600" />
                                    <span>{hotelDetails.address}</span>
                                </div>
                              
                            </div>
                        </div>

                        {/* Hotel Amenities */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {hotelDetails.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center text-gray-600">
                                        <amenity.icon className="w-5 h-5 mr-2 text-sky-600" />
                                        <span>{amenity.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reservation Details */}
                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-5 h-5 mr-2 text-sky-600" />
                                        <div>
                                            <p className="font-medium">Check-in: {formatDate(bookingData.checkIn)}</p>
                                            <p className="text-sm text-gray-500">After {hotelDetails.checkInTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-5 h-5 mr-2 text-sky-600" />
                                        <div>
                                            <p className="font-medium">Check-out: {formatDate(bookingData.checkOut)}</p>
                                            <p className="text-sm text-gray-500">Before {hotelDetails.checkOutTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Users className="w-5 h-5 mr-2 text-sky-600" />
                                        <span>{bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'} • {nights} {nights === 1 ? 'night' : 'nights'}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
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
                                        <p className="text-xl font-bold text-sky-700">{formatCurrency(bookingData.total * 1.12)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                      

                        {/* Guest Information */}
                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                                <div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Primary Guest</p>
                                            <p className="font-medium">{guestDetails.primaryGuest.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{guestDetails.primaryGuest.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{guestDetails.primaryGuest.phone}</p>
                                        </div>
                                    </div>
                                </div>
                               
                            {/* </div> */}
                        </div>


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
                                className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSendToEmail}
                                disabled={isEmailSending}
                            >
                                <Mail className="w-5 h-5 mr-2" />
                                {isEmailSending ? 'Sending...' : 'Send to Email'}
                            </button>
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
        </div>
    );
}
