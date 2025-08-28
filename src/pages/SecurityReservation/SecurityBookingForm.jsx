import React, { useState } from 'react';
import { Calendar, Clock, User, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SecurityBookingForm() {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [serviceType, setServiceType] = useState('personal');
    const [isBooking, setIsBooking] = useState(false);

    const serviceTypes = [
        {
            id: 'personal',
            name: 'Personal Security',
            description: 'Dedicated protection for individuals',
            icon: <User className="w-5 h-5 text-blue-600" />,
            price: 500
        },
    ];

    const selectedService = serviceTypes.find(s => s.id === serviceType) || serviceTypes[0];

    const calculateTotal = () => {
        if (!startDate || !endDate) return 0;
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
        return selectedService.price * days;
    };

    const handleBooking = (e) => {
        e.preventDefault();
        if (!startDate || !endDate) return;

        const bookingDetails = {
            bookingId: 'SEC' + Math.floor(10000000 + Math.random() * 90000000),
            startDate,
            endDate,
            serviceType: selectedService.name,
            total: calculateTotal(),
            serviceDescription: selectedService.description
        };

        // Navigate to security payment page with booking details
        navigate('/security/payment', { state: { bookingDetails } });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Book Security Service</h2>

            <form onSubmit={handleBooking} className="space-y-5">
                {/* Service Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                    <div className="space-y-2">
                        {serviceTypes.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => setServiceType(service.id)}
                                className={`p-3 border rounded-lg cursor-pointer transition-all flex items-start space-x-3 ${serviceType === service.id
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="mt-0.5">{service.icon}</div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                                    <p className="text-sm text-gray-500">{service.description}</p>
                                    <div className="mt-1 text-sm font-medium">
                                        ${service.price} <span className="text-gray-500 font-normal">/ day</span>
                                    </div>
                                </div>
                                {serviceType === service.id && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="date"
                                value={startDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="date"
                                value={endDate}
                                min={startDate || new Date().toISOString().split('T')[0]}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                                disabled={!startDate}
                            />
                        </div>
                    </div>
                </div>


                {/* Price Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Price Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                ${selectedService.price} per day
                            </span>
                        </div>
                        {startDate && endDate && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1} days
                                </span>
                                <span>${calculateTotal()}</span>
                            </div>
                        )}
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>${calculateTotal()}</span>
                        </div>
                    </div>
                </div>

                {/* Book Now Button */}
                <button

                    type="submit"
                    disabled={isBooking || !startDate || !endDate}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors ${isBooking || !startDate || !endDate ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                >
                    {isBooking ? 'Processing...' : 'Book Now'}
                </button>
            </form>
        </div>
    );
}
