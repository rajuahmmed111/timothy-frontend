import React, { useState } from 'react';
import { Calendar, Clock, User, Car, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CarBookingForm({ car }) {
    const navigate = useNavigate();
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    const calculateTotal = () => {
        if (!pickupDate || !returnDate) return 0;
        const days = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) || 1;
        const price = parseInt(car?.price?.replace('$', '') || '50');
        return price * days;
    };

    const handleBooking = (e) => {
        e.preventDefault();
        if (!pickupDate || !returnDate) return;

        const bookingDetails = {
            bookingId: 'CAR' + Math.floor(10000000 + Math.random() * 90000000),
            carName: car?.name || 'Selected Car',
            pickupDate,
            returnDate,
            carType: car?.name || 'Selected Car',
            total: calculateTotal(),
            carDescription: car?.description || 'Car rental booking',
            location: car?.location || 'Selected Location'
        };
        navigate('/car/payment', { state: { bookingDetails } });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Book Your Car</h2>

            <form onSubmit={handleBooking} className="space-y-5">
                {/* Selected Car */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selected Car</label>
                    <div className="p-3 border border-blue-500 bg-blue-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <Car className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{car?.name || 'Selected Car'}</h3>
                                <p className="text-sm text-gray-500">{car?.location || 'Location'}</p>
                                <div className="mt-1 text-sm font-medium">
                                    {car?.price} <span className="text-gray-500 font-normal">/ day</span>
                                </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Pickup Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="date"
                            value={pickupDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* Return Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="date"
                            value={returnDate}
                            min={pickupDate || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                            disabled={!pickupDate}
                        />
                    </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Price Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                {car?.price} per day
                            </span>
                        </div>
                        {pickupDate && returnDate && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    {Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) || 1} days
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
                    disabled={isBooking || !pickupDate || !returnDate}
                    className={`w-full bg-[#0064D2] hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors ${isBooking || !pickupDate || !returnDate ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                >
                    {isBooking ? 'Processing...' : 'Book Now'}
                </button>
            </form>
        </div>
    );
}
