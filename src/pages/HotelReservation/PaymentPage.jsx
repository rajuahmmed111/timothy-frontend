import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, ArrowLeft, Calendar, Users, Users2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get booking data from location state or use default values
    const bookingData = location.state?.bookingData || {
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: 2,
        roomType: 'Deluxe Room',
        total: 3500,
        hotelName: 'Luxury Beach Resort & Spa'
    };

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Format card number to add spaces after every 4 digits
    const formatCardNumber = (value) => {
        return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    // Format expiry date to MM/YY
    const formatExpiryDate = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})/, '$1/')
            .replace(/^(\d{2}\d{2}).*/, '$1');
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }
        
        if (!cardName.trim()) {
            newErrors.cardName = 'Cardholder name is required';
        }
        
        if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
            newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        }
        
        if (!cvv.match(/^\d{3,4}$/)) {
            newErrors.cvv = 'Please enter a valid CVV';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsProcessing(true);
            
            // Simulate API call
            setTimeout(() => {
                navigate('/booking-confirmation', {
                    state: {
                        ...bookingData,
                        bookingId: 'BK' + Math.floor(10000000 + Math.random() * 90000000),
                        bookingDate: new Date().toISOString().split('T')[0],
                        paymentMethod: `Card ending in ${cardNumber.slice(-4)}`
                    }
                });
                setIsProcessing(false);
            }, 1500);
        }
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

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-sky-600 hover:text-sky-800 font-medium mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to booking
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
                    <p className="text-gray-600">Secure payment with bank-level encryption</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-6">
                                    {/* Card Number */}
                                    <div>
                                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                                            Card Number
                                        </label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                id="card-number"
                                                value={formatCardNumber(cardNumber)}
                                                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                className={`w-full pl-11 pr-4 py-3 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors`}
                                            />
                                        </div>
                                        {errors.cardNumber && (
                                            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                                        )}
                                    </div>

                                    {/* Cardholder Name */}
                                    <div>
                                        <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            id="card-name"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            placeholder="John Doe"
                                            className={`w-full px-4 py-3 border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors`}
                                        />
                                        {errors.cardName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Expiry Date */}
                                        <div>
                                            <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                id="expiry-date"
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className={`w-full px-4 py-3 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors`}
                                            />
                                            {errors.expiryDate && (
                                                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                                            )}
                                        </div>

                                        {/* CVV */}
                                        <div>
                                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                id="cvv"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                                placeholder="123"
                                                maxLength={4}
                                                className={`w-full px-4 py-3 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors`}
                                            />
                                            {errors.cvv && (
                                                <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Security Info */}
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Lock className="w-4 h-4 mr-2 text-green-500" />
                                        <span>Your payment is secured with 256-bit SSL encryption</span>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className={`w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 flex items-center justify-center ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/20000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            'Pay Now'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Booking Summary</h2>
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-900 mb-2">{bookingData.hotelName}</h3>
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                        <Calendar className="w-4 h-4 mr-2 text-sky-600" />
                                        <span>{new Date(bookingData.checkIn).toLocaleDateString()} - {new Date(bookingData.checkOut).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users2 className="w-4 h-4 mr-2 text-sky-600" />
                                        <span>{bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Room ({bookingData.roomType})</span>
                                        <span>{formatCurrency(bookingData.total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Taxes & Fees</span>
                                        <span>{formatCurrency(bookingData.total * 0.12)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>{formatCurrency(bookingData.total * 1.12)}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-600">
                                            Free cancellation up to 24 hours before check-in. Full refund if cancelled within the free cancellation period.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
