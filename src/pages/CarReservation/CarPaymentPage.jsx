import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, CreditCard, Lock, ArrowLeft, Car, Calendar, MapPin } from 'lucide-react';

export default function CarPaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingDetails } = location.state || {};

    const [isProcessing, setIsProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');

    const handlePayment = (e) => {
        e.preventDefault();
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) return;

        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            // In a real app, you would process the payment here
            console.log('Payment processed:', {
                ...bookingDetails,
                cardLast4: cardNumber.slice(-4)
            });

            // Navigate to car booking confirmation page
            navigate('/car/booking-confirmation', {
                state: {
                    bookingDetails: {
                        ...bookingDetails,
                        paymentStatus: 'completed',
                        paymentDate: new Date().toISOString(),
                        paymentMethod: `•••• •••• •••• ${cardNumber.slice(-4)}`
                    }
                }
            });

            setIsProcessing(false);
        }, 2000);
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handleCardNumberChange = (e) => {
        const formattedNumber = formatCardNumber(e.target.value);
        setCardNumber(formattedNumber);
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 3) {
            return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
        }
        return v;
    };

    const handleExpiryDateChange = (e) => {
        const formattedDate = formatExpiryDate(e.target.value);
        setExpiryDate(formattedDate);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Complete Your Car Booking</h1>
                        <p className="text-gray-600 mt-1">Enter your payment details to confirm your car rental</p>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Booking Summary</h2>
                            </div>

                            {bookingDetails && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start space-x-3 mb-4">
                                        <Car className="w-5 h-5 text-blue-600 mt-1" />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{bookingDetails.carName}</h3>
                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span>{bookingDetails.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Booking ID</span>
                                            <span className="font-medium">{bookingDetails.bookingId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Pickup Date</span>
                                            <span>{new Date(bookingDetails.pickupDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Return Date</span>
                                            <span>{new Date(bookingDetails.returnDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Duration</span>
                                            <span>
                                                {Math.ceil((new Date(bookingDetails.returnDate) - new Date(bookingDetails.pickupDate)) / (1000 * 60 * 60 * 24)) || 1} days
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-medium pt-2 mt-2 border-t border-gray-200">
                                            <span>Total Amount</span>
                                            <span className="text-lg">${bookingDetails.total}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={handleCardNumberChange}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                value={expiryDate}
                                                onChange={handleExpiryDateChange}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                    placeholder="123"
                                                    maxLength={4}
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                        <input
                                            type="text"
                                            value={cardholderName}
                                            onChange={(e) => setCardholderName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                       

                            <button
                                type="submit"
                                disabled={isProcessing || !cardNumber || !expiryDate || !cvv || !cardholderName}
                                className={`w-full bg-[#0064D2] hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors ${isProcessing || !cardNumber || !expiryDate || !cvv || !cardholderName
                                    ? 'opacity-70 cursor-not-allowed'
                                    : ''
                                    }`}
                            >
                                {isProcessing ? 'Processing Payment...' : `Pay $${bookingDetails?.total || '0'}`}
                            </button>

                           
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
