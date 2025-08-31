import React, { useState } from 'react';
import { Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, Space, Button } from 'antd';
import { UserOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import { DatePicker } from "antd";


export default function BookingForm() {
    const navigate = useNavigate();
    const [selectedRoom, setSelectedRoom] = useState('deluxe');
    const [isBooking, setIsBooking] = useState(false);
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        rooms: 1
    });
    const { Option } = Select;
    const [dateRange, setDateRange] = useState(null);

    const { RangePicker } = DatePicker;

    const handleGuestsChange = (type, value) => {
        setGuests(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const validateForm = () => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            alert('Please select check-in and check-out dates');
            return false;
        }
        if (guests.adults === 0) {
            alert('Please select at least 1 adult');
            return false;
        }
        if (guests.rooms === 0) {
            alert('Please select at least 1 room');
            return false;
        }
        return true;
    };

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
    
    // Calculate nights from dateRange
    const nights = dateRange && dateRange[0] && dateRange[1] 
        ? Math.ceil((dateRange[1].toDate().getTime() - dateRange[0].toDate().getTime()) / (1000 * 3600 * 24))
        : 1;
    
    const total = selectedRoomData.price * nights;

    const handleBooking = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsBooking(true);

        // Navigate to checkout page with booking data
        navigate('/hotel/checkout', {
            state: {
                bookingData: {
                    checkIn: dateRange[0].format('YYYY-MM-DD'),
                    checkOut: dateRange[1].format('YYYY-MM-DD'),
                    guests,
                    roomType: rooms.find(room => room.id === selectedRoom)?.name || 'Deluxe Room',
                    roomPrice: selectedRoomData.price,
                    nights: nights,
                    subtotal: selectedRoomData.price * nights,
                    total: Math.round(selectedRoomData.price * 1.22 * nights),
                    hotelName: 'Luxury Beach Resort & Spa',
                    location: 'Maldives'
                }
            }
        });

        setIsBooking(false);
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
                <div className="">
                    {/* Check-in & Check-out */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in and Check-out</label>
                    <RangePicker
                        placeholder={['Check-in', 'Check-out']}
                        value={dateRange}
                        onChange={setDateRange}
                        style={{ width: '100%', height: '48px' }}
                        className="border-gray-300 rounded-lg focus:border-[#0064D2] focus:ring-1 focus:ring-[#0064D2]"
                        disabledDate={(current) => current && current < new Date().setHours(0, 0, 0, 0)}
                    />
                </div>

                {/* Guests */}
                <div className="space-y-2 h-full flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests and Rooms</label>

                    <Select
                        value={guests.adults === 0 && guests.children === 0 && guests.rooms === 0
                            ? null
                            : `${guests.adults} ${guests.adults !== 1 ? 'adults' : 'adult'} · ${guests.children} ${guests.children !== 1 ? 'children' : 'child'} · ${guests.rooms} ${guests.rooms !== 1 ? 'rooms' : 'room'}`}
                        placeholder="0 adults · 0 children · 0 rooms"
                        className="w-full h-full [&>div]:h-full [&>div]:py-2.5 [&>div]:px-3"
                        style={{ height: '100%' }}
                        dropdownMatchSelectWidth={false}
                        dropdownRender={() => (
                            <div className="p-4 space-y-4 min-w-[300px]">
                                {/* Adults Counter */}
                                <div className="flex justify-between items-center">
                                    <Space>
                                        <UserOutlined className="text-gray-600" />
                                        <span>Adults</span>
                                    </Space>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => handleGuestsChange('adults', Math.max(1, guests.adults - 1))}
                                            disabled={guests.adults <= 1}
                                            className="flex items-center justify-center w-8 h-8"
                                        >
                                            -
                                        </Button>
                                        <span className="w-8 text-center">{guests.adults}</span>
                                        <Button
                                            onClick={() => handleGuestsChange('adults', guests.adults + 1)}
                                            disabled={guests.adults >= 8}
                                            className="flex items-center justify-center w-8 h-8"
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* Children Counter */}
                                <div className="flex justify-between items-center">
                                    <Space>
                                        <TeamOutlined className="text-gray-600" />
                                        <span>Children</span>
                                    </Space>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => handleGuestsChange('children', Math.max(0, guests.children - 1))}
                                            disabled={guests.children <= 0}
                                            className="flex items-center justify-center w-8 h-8"
                                        >
                                            -
                                        </Button>
                                        <span className="w-8 text-center">{guests.children}</span>
                                        <Button
                                            onClick={() => handleGuestsChange('children', guests.children + 1)}
                                            disabled={guests.children >= 4}
                                            className="flex items-center justify-center w-8 h-8"
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* Rooms Counter */}
                                <div className="flex justify-between items-center">
                                    <Space>
                                        <HomeOutlined className="text-gray-600" />
                                        <span>Rooms</span>
                                    </Space>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => handleGuestsChange('rooms', Math.max(1, guests.rooms - 1))}
                                            disabled={guests.rooms <= 1}
                                            className="flex items-center justify-center w-8 h-8"
                                        >
                                            -
                                        </Button>
                                        <span className="w-8 text-center">{guests.rooms}</span>
                                        <Button
                                            onClick={() => handleGuestsChange('rooms', guests.rooms + 1)}
                                            disabled={guests.rooms >= 5}
                                            className="flex items-center justify-center w-8 h-8"
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    >
                        <Option value="guests">
                            {`${guests.adults} ${guests.adults !== 1 ? 'adults' : 'adult'} · ${guests.children} ${guests.children !== 1 ? 'children' : 'child'} · ${guests.rooms} ${guests.rooms !== 1 ? 'rooms' : 'room'}`}
                        </Option>
                    </Select>
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
                        <span>${selectedRoomData.price} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
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

                <button
                    type="submit"
                    disabled={isBooking}
                    className="w-full bg-[#0064D2] text-white px-4 py-2 rounded-lg text-sm font-bold"
                >
                    {isBooking ? 'Processing...' : 'Continue to Checkout'}
                </button>
            </form>
        </div>
    );
}