import React, { useState } from 'react';
import { User, CheckCircle, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from "antd";


export default function SecurityBookingForm() {
    const navigate = useNavigate();
    const [serviceType, setServiceType] = useState('personal');
    const [isBooking, ] = useState(false);
    const [dateRange, setDateRange] = useState(null);
    const [personnelCount, setPersonnelCount] = useState(1);

    const { RangePicker } = DatePicker;

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
        if (!dateRange || !dateRange[0] || !dateRange[1]) return 0;
        const days = Math.ceil((dateRange[1].toDate().getTime() - dateRange[0].toDate().getTime()) / (1000 * 60 * 60 * 24)) || 1;
        return selectedService.price * days * personnelCount;
    };

    const increasePersonnel = () => {
        setPersonnelCount(prev => prev + 1);
    };

    const decreasePersonnel = () => {
        setPersonnelCount(prev => prev > 1 ? prev - 1 : 1);
    };

    const getDays = () => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) return 0;
        return Math.ceil((dateRange[1].toDate().getTime() - dateRange[0].toDate().getTime()) / (1000 * 60 * 60 * 24)) || 1;
    };

    const handleBooking = (e) => {
        e.preventDefault();
        if (!dateRange || !dateRange[0] || !dateRange[1]) return;

        const bookingDetails = {
            bookingId: 'SEC' + Math.floor(10000000 + Math.random() * 90000000),
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD'),
            serviceType: selectedService.name,
            personnelCount: personnelCount,
            total: calculateTotal(),
            serviceDescription: selectedService.description
        };

        // Navigate to security checkout page with booking details
        navigate('/security/checkout', { state: { bookingDetails } });
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date and End Date</label>

                    {/* Check-in & Check-out */}
                    <RangePicker
                        placeholder={['Start-date', 'End-date']}
                        value={dateRange}
                        onChange={setDateRange}
                        style={{ width: '100%', height: '48px' }}
                        className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabledDate={(current) => current && current < new Date().setHours(0, 0, 0, 0)}
                    />
                </div>

                {/* Personnel Count */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Security Personnel</label>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg p-3">
                        <button
                            type="button"
                            onClick={decreasePersonnel}
                            disabled={personnelCount <= 1}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                personnelCount <= 1 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="text-lg font-medium text-gray-900">{personnelCount}</span>
                            <span className="text-sm text-gray-500">
                                {personnelCount === 1 ? 'person' : 'people'}
                            </span>
                        </div>
                        
                        <button
                            type="button"
                            onClick={increasePersonnel}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Price Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                ${selectedService.price} per day per person
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                {personnelCount} {personnelCount === 1 ? 'person' : 'people'}
                            </span>
                            <span>${selectedService.price * personnelCount} per day</span>
                        </div>
                        {dateRange && dateRange[0] && dateRange[1] && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    {getDays()} {getDays() === 1 ? 'day' : 'days'}
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
                    disabled={isBooking || !dateRange || !dateRange[0] || !dateRange[1]}
                    className={`w-full bg-[#0064D2] text-white py-3 px-6 rounded-lg font-medium transition-colors ${
                        isBooking || !dateRange || !dateRange[0] || !dateRange[1] 
                            ? 'opacity-70 cursor-not-allowed' 
                            : 'hover:bg-blue-700'
                    }`}
                >
                    {isBooking ? 'Processing...' : 'Continue to Checkout'}
                </button>
            </form>
        </div>
    );
}
