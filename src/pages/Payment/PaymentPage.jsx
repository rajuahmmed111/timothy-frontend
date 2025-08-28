import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, CreditCard, Lock, ArrowLeft } from 'lucide-react';

export default function SecurityPaymentPage() {
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
            
            // Navigate to security booking confirmation page
            navigate('/security/booking-confirmation', {
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
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to booking
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
                        <p className="text-gray-600 mt-1">Enter your payment details to confirm your security service</p>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                                <span className="text-sm text-blue-600">Edit</span>
                            </div>
                            
                            {bookingDetails && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Service</span>
                                        <span className="font-medium">{bookingDetails.serviceType}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Duration</span>
                                        <span>
                                            {new Date(bookingDetails.startDate).toLocaleDateString()} - {new Date(bookingDetails.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-medium pt-2 mt-2 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>${bookingDetails.total}</span>
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
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Lock className="w-4 h-4 mr-1 text-green-500" />
                                    <span>Secure payment</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2">We accept</span>
                                    <div className="flex space-x-2">
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">VISA</span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">MC</span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">AMEX</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing || !cardNumber || !expiryDate || !cvv || !cardholderName}
                                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors ${
                                    isProcessing || !cardNumber || !expiryDate || !cvv || !cardholderName 
                                        ? 'opacity-70 cursor-not-allowed' 
                                        : ''
                                }`}
                            >
                                {isProcessing ? 'Processing...' : `Pay $${bookingDetails?.total || '0'}`}
                            </button>

                            <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                                <Shield className="w-4 h-4 mr-2 text-green-500" />
                                <span>Your payment is secure and encrypted</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
