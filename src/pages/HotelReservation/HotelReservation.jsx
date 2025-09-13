import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Select, Space, Slider, Input } from 'antd';
import { UserOutlined, TeamOutlined, HomeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { DatePicker, Button } from "antd";


import ing1 from "/hotel/1.png"
import ing2 from "/hotel/2.png"
import ing3 from "/hotel/3.png"
import ing4 from "/hotel/4.png"
import HotelCard from '../../components/HotelCard/HotelCard';


export default function HotelReservation() {
    const [dateRange, setDateRange] = useState(null);
    const [guests, setGuests] = useState({
        adults: 0,
        children: 0,
        rooms: 0
    });
    const [filters, setFilters] = useState({
        priceRange: [0, 600],
        nameSearch: '',
        selectedCity: ''
    });
    const [filteredHotels, setFilteredHotels] = useState([]);
    const { RangePicker } = DatePicker;
    const { Option } = Select;


    const handleGuestsChange = (type, value) => {
        setGuests(prev => ({
            ...prev,
            [type]: value
        }));
    };

    // Filter functions
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const hotels = [
        {
            name: "The Plaza Hotel",
            location: "New York, USA",
            image: ing1,
            price: "$580",
            rating: 5,
        },
        {
            name: "Budget Inn",
            location: "Los Angeles, USA",
            image: ing2,
            price: "$89",
            rating: 3,
        },
        {
            name: "Majestic Serenity Palace",
            location: "Miami, USA",
            image: ing3,
            price: "$425",
            rating: 5,
        },
        {
            name: "Grand Central Hotel",
            location: "Chicago, USA",
            image: ing4,
            price: "$320",
            rating: 4,
        },
        {
            name: "Ocean View Resort",
            location: "Miami, USA",
            image: ing1,
            price: "$275",
            rating: 4,
        },
        {
            name: "City Center Lodge",
            location: "Chicago, USA",
            image: ing2,
            price: "$150",
            rating: 3,
        },
        {
            name: "Royal Paradise Hotel",
            location: "Las Vegas, USA",
            image: ing3,
            price: "$199",
            rating: 4,
        },
        {
            name: "Sunset Boulevard Inn",
            location: "Los Angeles, USA",
            image: ing4,
            price: "$245",
            rating: 4,
        },
        {
            name: "Metropolitan Luxury Suites",
            location: "New York, USA",
            image: ing1,
            price: "$495",
            rating: 5,
        },
        {
            name: "Desert Oasis Hotel",
            location: "Las Vegas, USA",
            image: ing2,
            price: "$135",
            rating: 3,
        },
        {
            name: "Beachfront Paradise",
            location: "Miami, USA",
            image: ing3,
            price: "$380",
            rating: 5,
        },
        {
            name: "Downtown Business Hotel",
            location: "Chicago, USA",
            image: ing4,
            price: "$210",
            rating: 4,
        }
    ];

    // Apply filters to hotels
    React.useEffect(() => {
        let filtered = hotels.filter(hotel => {
            const price = parseInt(hotel.price.replace('$', ''));
            const priceInRange = price >= filters.priceRange[0] && price <= filters.priceRange[1];
            const nameMatch = hotel.name.toLowerCase().includes(filters.nameSearch.toLowerCase());
            const cityMatch = filters.selectedCity === '' || hotel.location.includes(filters.selectedCity);
            
            return priceInRange && nameMatch && cityMatch;
        });
        setFilteredHotels(filtered);
    }, [filters, hotels]);

    // Get unique cities for dropdown
    const uniqueCities = [...new Set(hotels.map(hotel => {
        const city = hotel.location.split(',')[0].trim();
        return city;
    }))];

    // Initialize filtered hotels
    React.useEffect(() => {
        setFilteredHotels(hotels);
    }, []);
    return (
        <div className='py-16 container mx-auto'>
            <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 ">
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
            {/* Main Content with Sidebar and Hotels */}
            <div className="flex gap-6 py-10">
                {/* Filter Sidebar */}
                <div className="w-80 bg-white p-6 rounded-2xl shadow-lg h-fit">
                    <div className="flex items-center gap-2 mb-6">
                        <FilterOutlined className="text-[#0064D2]" />
                        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                    </div>

                    {/* Name Search Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                        <Input
                            placeholder="Search by hotel name"
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={filters.nameSearch}
                            onChange={(e) => handleFilterChange('nameSearch', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* City Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <Select
                            placeholder="Select city"
                            value={filters.selectedCity}
                            onChange={(value) => handleFilterChange('selectedCity', value)}
                            className="w-full"
                            allowClear
                        >
                            {uniqueCities.map(city => (
                                <Option key={city} value={city}>{city}</Option>
                            ))}
                        </Select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                        </label>
                        <Slider
                            range
                            min={0}
                            max={600}
                            value={filters.priceRange}
                            onChange={(value) => handleFilterChange('priceRange', value)}
                            className="w-full"
                            trackStyle={[{ backgroundColor: '#0064D2' }]}
                            handleStyle={[{ borderColor: '#0064D2' }, { borderColor: '#0064D2' }]}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>$0</span>
                            <span>$600</span>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <Button
                        onClick={() => setFilters({ priceRange: [0, 600], nameSearch: '', selectedCity: '' })}
                        className="w-full"
                        type="default"
                    >
                        Clear All Filters
                    </Button>
                </div>

                {/* Hotels Grid */}
                <div className="flex-1">
                    <div className="mb-4">
                        <p className="text-gray-600">
                            Showing {filteredHotels.length} of {hotels.length} hotels
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredHotels.map((hotel, index) => (
                            <HotelCard key={index} hotel={hotel} />
                        ))}
                    </div>
                    {filteredHotels.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No hotels found matching your criteria</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}