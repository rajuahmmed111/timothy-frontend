import React, { useState } from "react";
import { Link } from "react-router-dom"
import { Select, Space } from 'antd';
import { UserOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import { DatePicker, Button } from "antd";

export default function Hero() {
    const [dateRange, setDateRange] = useState(null);
    const [guests, setGuests] = useState({
        adults: 2,
        children: 0,
        rooms: 0
    });

    const { RangePicker } = DatePicker;

    const { Option } = Select;


    const handleGuestsChange = (type, value) => {
        setGuests(prev => ({
            ...prev,
            [type]: value
        }));
    };
    return (
        <section
            className="relative h-[600px] bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/hotel.png')`,
            }}
        >
            <div className="container mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2 px-5 md:px-0 flex flex-col justify-end pb-10">
                <div>
                    <h1 className="text-7xl font-bold mb-10 text-white">Book Your Stays</h1>
                    {/* Custom Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                            {/* Location Input */}
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Search For Your Stays"
                                    className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                                />
                            </div>

                            {/* Check-in & Check-out */}
                            <RangePicker
                                placeholder={['Check-in', 'Check-out']}
                                value={dateRange}
                                onChange={setDateRange}
                                style={{ width: '100%' }}
                            />

                            {/* Guests and Rooms */}
                            <div className="space-y-2 h-full flex flex-col">
                                <Select
                                    value={`${guests.adults} ${guests.adults !== 1 ? 'adults' : 'adult'} · ${guests.children} ${guests.children !== 1 ? 'children' : 'child'} · ${guests.rooms} ${guests.rooms !== 1 ? 'rooms' : 'room'}`}
                                    placeholder="2 adults · 0 children · 0 room"
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
                                                        onClick={() => handleGuestsChange('adults', Math.max(2, guests.adults - 1))}
                                                        disabled={guests.adults <= 2}
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
                                                        onClick={() => handleGuestsChange('rooms', Math.max(0, guests.rooms - 1))}
                                                        disabled={guests.rooms <= 0}
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

                        </div>
                        {/* Search Button */}
                        <div className="">
                            <Link to="/hotel" className="w-full">
                                <button className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
                                    Search
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}







