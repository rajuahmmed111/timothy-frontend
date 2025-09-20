import React, { useState } from "react";
import { CreditCard, Plus, Edit, Trash2, Shield, Check, X } from "lucide-react";

export default function PaymentMethods() {
    const [showAddCard, setShowAddCard] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [newCard, setNewCard] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        isDefault: false
    });

    const [paymentMethods, setPaymentMethods] = useState([
        {
            id: 1,
            type: 'visa',
            cardNumber: '**** **** **** 4532',
            cardholderName: 'Shah Aman',
            expiryDate: '12/26',
            isDefault: true,
            addedDate: '2024-01-15'
        },
        {
            id: 2,
            type: 'mastercard',
            cardNumber: '**** **** **** 8901',
            cardholderName: 'Shah Aman',
            expiryDate: '08/25',
            isDefault: false,
            addedDate: '2024-02-20'
        },
        {
            id: 3,
            type: 'amex',
            cardNumber: '**** **** **** 2345',
            cardholderName: 'Shah Aman',
            expiryDate: '03/27',
            isDefault: false,
            addedDate: '2024-03-10'
        }
    ]);

    const getCardIcon = (type) => {
        switch (type) {
            case 'visa':
                return '💳';
            case 'mastercard':
                return '💳';
            case 'amex':
                return '💳';
            default:
                return '💳';
        }
    };

    const getCardColor = (type) => {
        switch (type) {
            case 'visa':
                return 'from-blue-500 to-blue-600';
            case 'mastercard':
                return 'from-red-500 to-red-600';
            case 'amex':
                return 'from-green-500 to-green-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
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

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 3) {
            return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
        }
        return v;
    };

    const handleCardNumberChange = (e) => {
        const formattedNumber = formatCardNumber(e.target.value);
        setNewCard({ ...newCard, cardNumber: formattedNumber });
    };

    const handleExpiryDateChange = (e) => {
        const formattedDate = formatExpiryDate(e.target.value);
        setNewCard({ ...newCard, expiryDate: formattedDate });
    };

    const handleAddCard = (e) => {
        e.preventDefault();
        if (!newCard.cardNumber || !newCard.expiryDate || !newCard.cvv || !newCard.cardholderName) return;

        const cardType = detectCardType(newCard.cardNumber);
        const maskedNumber = `**** **** **** ${newCard.cardNumber.slice(-4)}`;

        const newPaymentMethod = {
            id: Date.now(),
            type: cardType,
            cardNumber: maskedNumber,
            cardholderName: newCard.cardholderName,
            expiryDate: newCard.expiryDate,
            isDefault: paymentMethods.length === 0 || newCard.isDefault,
            addedDate: new Date().toISOString().split('T')[0]
        };

        if (newCard.isDefault) {
            setPaymentMethods(prev => prev.map(card => ({ ...card, isDefault: false })));
        }

        setPaymentMethods([...paymentMethods, newPaymentMethod]);
        setNewCard({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardholderName: '',
            isDefault: false
        });
        setShowAddCard(false);
    };

    const detectCardType = (cardNumber) => {
        const number = cardNumber.replace(/\s/g, '');
        if (number.startsWith('4')) return 'visa';
        if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
        if (number.startsWith('3')) return 'amex';
        return 'visa';
    };

    const handleSetDefault = (id) => {
        setPaymentMethods(prev => prev.map(card => ({
            ...card,
            isDefault: card.id === id
        })));
    };

    const handleDeleteCard = (id) => {
        if (window.confirm('Are you sure you want to delete this payment method?')) {
            setPaymentMethods(prev => prev.filter(card => card.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 mt-10">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Methods</h1>
                    <p className="text-gray-600">Manage your saved payment methods for faster checkout</p>
                </div>

                {/* Add New Card Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowAddCard(true)}
                        className="flex items-center gap-2 bg-[#0064D2] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Payment Method
                    </button>
                </div>

                {/* Add Card Form */}
                {showAddCard && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Add New Payment Method</h3>
                            <button
                                onClick={() => setShowAddCard(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={newCard.cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input
                                        type="text"
                                        value={newCard.expiryDate}
                                        onChange={handleExpiryDateChange}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                    <input
                                        type="text"
                                        value={newCard.cvv}
                                        onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                        placeholder="123"
                                        maxLength={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                <input
                                    type="text"
                                    value={newCard.cardholderName}
                                    onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={newCard.isDefault}
                                    onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                                    Set as default payment method
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="bg-[#0064D2] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Add Payment Method
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddCard(false)}
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Payment Methods List */}
                <div className="space-y-4">
                    {paymentMethods.map((card) => (
                        <div key={card.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {/* Card Visual */}
                                        <div className={`w-16 h-10 bg-gradient-to-r ${getCardColor(card.type)} rounded-lg flex items-center justify-center text-white text-xl`}>
                                            {getCardIcon(card.type)}
                                        </div>

                                        {/* Card Details */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">{card.cardNumber}</h3>
                                                {card.isDefault && (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{card.cardholderName}</p>
                                            <p className="text-sm text-gray-500">Expires {card.expiryDate}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-2">
                                        {!card.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(card.id)}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setEditingCard(card.id)}
                                            className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCard(card.id)}
                                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>Added on {new Date(card.addedDate).toLocaleDateString()}</span>
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-4 h-4 text-green-500" />
                                            <span>Secured</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {paymentMethods.length === 0 && (
                    <div className="text-center py-12">
                        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No payment methods</h3>
                        <p className="text-gray-600 mb-4">Add a payment method to make checkout faster and easier</p>
                        <button
                            onClick={() => setShowAddCard(true)}
                            className="bg-[#0064D2] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Add Your First Payment Method
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
