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
    const [cardName, setCardName] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!cardNumber || !expiryDate || !cvv || !cardName) return;
        
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

                        {/* Payment Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                                    <div className="flex items-center space-x-3">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png" alt="PayPal" className="h-6" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="MasterCard" className="h-6" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                                    </div>
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
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
