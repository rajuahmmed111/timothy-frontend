import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, CreditCard, Download, Home, Users, Star, Clock, Phone, Mail, User, DollarSign } from 'lucide-react';

export default function EventBookingConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingDetails } = location.state || {};
    const [isEmailSending, setIsEmailSending] = useState(false);

    const handleDownloadReceipt = () => {
        // In a real app, this would generate and download a PDF receipt
        console.log('Downloading receipt for booking:', bookingDetails?.bookingId);
        alert('Receipt download functionality would be implemented here');
    };

    const handleBackToHome = () => {
        navigate('/');
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
            //     body: JSON.stringify({ bookingDetails, guestDetails })
            // });
            
            alert('Event booking confirmation has been sent to your email!');
        } catch (error) {
            alert('Failed to send email. Please try again.');
        } finally {
            setIsEmailSending(false);
        }
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
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-green-50 p-6 text-center border-b border-green-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                        <p className="text-gray-600">Your event reservation has been successfully booked</p>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Event Information */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-8 h-8 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {bookingDetails.eventName || 'Burj Khalifa: Floors 124 & 125'}
                                        </h3>
                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center mr-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                                ))}
                                                <span className="ml-1 text-sm text-gray-600">(4.8)</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span>{bookingDetails.location || 'Downtown Dubai, Dubai, UAE'}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            Experience breathtaking views from the world's tallest building. Visit the observation decks on floors 124 & 125 for panoramic views of Dubai's skyline, desert, and coastline.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Information */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-900">Event Date & Time</h3>
                                                <p className="text-sm text-gray-500">
                                                    {bookingDetails.selectedDate ? new Date(bookingDetails.selectedDate).toLocaleDateString('en-US', { 
                                                        weekday: 'long', 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    }) : 'December 15, 2024'}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {bookingDetails.selectedTime || '2:00 PM - 4:00 PM'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-900">Guest Count</h3>
                                                <p className="text-sm text-gray-500">
                                                    {bookingDetails.guests || 2} guest{(bookingDetails.guests || 2) > 1 ? 's' : ''}
                                                </p>
                                                <p className="text-sm text-gray-400">Adult tickets included</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                <MapPin className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-900">Meeting Point</h3>
                                                <p className="text-sm text-gray-500">Burj Khalifa Entrance</p>
                                                <p className="text-sm text-gray-400">Level B2, Dubai Mall</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                                <CreditCard className="h-5 w-5 text-yellow-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-900">Booking ID</h3>
                                                <p className="text-sm text-gray-500 font-mono">
                                                    {bookingDetails.bookingId || 'EVT-2024-001234'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                                <DollarSign className="h-5 w-5 text-yellow-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-900">Total</h3>
                                                <p className="text-sm text-gray-500 font-mono">
                                                   $1000
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-900">Primary Guest</h3>
                                                <p className="text-sm text-gray-500">
                                                    {bookingDetails.guestName || 'John Smith'}
                                                </p>
                                                <p className="text-sm text-gray-400">Lead visitor</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-900">Email Address</h3>
                                                <p className="text-sm text-gray-500">
                                                    {bookingDetails.email || 'john.smith@email.com'}
                                                </p>
                                                <p className="text-sm text-gray-400">Confirmation sent</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                      

                                        {bookingDetails.specialRequests && (
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                    <Calendar className="h-5 w-5 text-orange-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-sm font-medium text-gray-900">Special Requests</h3>
                                                    <p className="text-sm text-gray-500">{bookingDetails.specialRequests}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                             
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Event Tickets ({bookingDetails.guests || 2} guests)</span>
                                        <span>${(bookingDetails.total || 650) - 50}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Service Fee</span>
                                        <span>$50</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                                        <span>Total Paid</span>
                                        <span className="text-green-600">${bookingDetails.total || 650}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-2">
                                        <span className="text-gray-600">Payment Method</span>
                                        <span>{bookingDetails.paymentMethod || '•••• •••• •••• 1234'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className="text-green-600 font-medium">✓ Confirmed</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Payment Date</span>
                                        <span>{bookingDetails.paymentDate ? new Date(bookingDetails.paymentDate).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                                    </div>
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

                            <button
                                onClick={handleSendToEmail}
                                disabled={isEmailSending}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Mail className="w-5 h-5 mr-2" />
                                {isEmailSending ? 'Sending...' : 'Send to Email'}
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
