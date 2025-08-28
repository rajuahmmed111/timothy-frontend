import React, { useState } from 'react';
import { Calendar, Users, ChevronDown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingForm() {
    const navigate = useNavigate();
    const [checkIn, setCheckIn] = useState('2024-03-15');
    const [checkOut, setCheckOut] = useState('2024-03-18');
    const [guests, setGuests] = useState(2);
    const [selectedRoom, setSelectedRoom] = useState('deluxe');
    const [showGuestSelector, setShowGuestSelector] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const rooms = [
        {
            id: 'deluxe',
            name: 'Deluxe Room',
            price: 500,
            features: ['Ocean View', 'King Bed', 'Mini Bar'],
            rating: 4.8
        },
        {
            id: 'family',
            name: 'Family Room',
            price: 650,
            features: ['Two Queen Beds', 'Living Area', 'Kitchenette'],
            rating: 4.9
        },
        {
            id: 'suite',
            name: 'Luxury Suite',
            price: 900,
            features: ['Separate Living Room', 'Ocean View', 'Private Terrace'],
            rating: 5.0
        }
    ];

    const selectedRoomData = rooms.find(room => room.id === selectedRoom) || rooms[0];
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24));
    const total = selectedRoomData.price * nights;

    const handleBooking = (e) => {
        e.preventDefault();
        setIsBooking(true);
        
        // Simulate API call
        setTimeout(() => {
            // In a real app, you would pass booking details via state or context
            navigate('/booking-confirmation', {
                state: {
                    bookingId: 'BK' + Math.floor(10000000 + Math.random() * 90000000),
                    checkIn,
                    checkOut,
                    guests,
                    roomType: rooms.find(room => room.id === selectedRoom)?.name || 'Deluxe Room',
                    total: total
                }
            });
            setIsBooking(false);
        }, 1500);
    };


    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 sticky top-5">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">${selectedRoomData.price}</span>
                    <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{selectedRoomData.rating}</span>
                    </div>
                </div>
                <span className="text-gray-600">per night</span>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="date"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="date"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Guests */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <button
                            type="button"
                            onClick={() => setShowGuestSelector(!showGuestSelector)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-left flex items-center justify-between"
                        >
                            <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showGuestSelector ? 'rotate-180' : ''}`} />
                        </button>
                        {showGuestSelector && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Guests</span>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setGuests(Math.max(1, guests - 1))}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-4 text-center">{guests}</span>
                                            <button
                                                type="button"
                                                onClick={() => setGuests(Math.min(8, guests + 1))}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Room Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                    <div className="space-y-2">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedRoom === room.id
                                    ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedRoom(room.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-medium text-gray-900">{room.name}</h3>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                                <span>{room.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {room.features.map((feature, index) => (
                                                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">${room.price}</div>
                                        <div className="text-xs text-gray-500">per night</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>${selectedRoomData.price} × {nights} nights</span>
                        <span>${selectedRoomData.price * nights}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>${Math.round(total * 0.1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Taxes</span>
                        <span>${Math.round(total * 0.12)}</span>
                    </div>
                    <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>${Math.round(total * 1.22)}</span>
                        </div>
                    </div>
                </div>

                {/* Guest Information */}
                <div className="border-t pt-4 space-y-4">
                    <h3 className="font-medium text-gray-900">Guest Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        />
                    </div>
                </div>


                <button 
                    type="submit" 
                    className="w-full bg-[#0064D2] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/hotel/payment', {
                            state: {
                                bookingData: {
                                    checkIn,
                                    checkOut,
                                    guests,
                                    roomType: rooms.find(room => room.id === selectedRoom)?.name || 'Deluxe Room',
                                    total: Math.round(selectedRoomData.price * 1.22 * nights), // Including taxes
                                    hotelName: 'Luxury Beach Resort & Spa',
                                    location: 'Maldives'
                                }
                            }
                        });
                    }}
                >
                    Reserve Now
                </button>
            </form>
        </div>
    );
}