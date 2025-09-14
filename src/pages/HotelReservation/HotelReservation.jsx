import React, { useState, useEffect } from 'react';

import { Select, Space, Slider, Input } from 'antd';
import { UserOutlined, TeamOutlined, HomeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { DatePicker, Button } from "antd";
import { useBooking } from '../../context/BookingContext';

import ing1 from "/hotel/1.png"
import ing2 from "/hotel/2.png"
import ing3 from "/hotel/3.png"
import ing4 from "/hotel/4.png"
import HotelCard from '../../components/HotelCard/HotelCard';


export default function HotelReservation() {
    const { bookingData, updateBookingData, updateGuests } = useBooking();
    const [filters, setFilters] = useState({
        priceRange: [0, 600],
        nameSearch: '',
        selectedCity: ''
    });
    const [mainSearch, setMainSearch] = useState('');
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const { RangePicker } = DatePicker;
    const { Option } = Select;


    const handleGuestsChange = (type, value) => {
        updateGuests({
            [type]: value
        });
    };

    const handleDateChange = (dates) => {
        updateBookingData({
            dateRange: dates
        });
    };

    // Initialize search with data from Hero component
    useEffect(() => {
        if (bookingData.searchQuery) {
            setMainSearch(bookingData.searchQuery);
        }
    }, [bookingData.searchQuery]);

    // Filter functions
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleSearch = () => {
        // Scroll to results section
        const resultsSection = document.getElementById('hotels-results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
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
            
            // Main search functionality - searches both name and location
            const mainSearchMatch = mainSearch === '' || 
                hotel.name.toLowerCase().includes(mainSearch.toLowerCase()) ||
                hotel.location.toLowerCase().includes(mainSearch.toLowerCase());
            
            return priceInRange && nameMatch && cityMatch && mainSearchMatch;
        });
        setFilteredHotels(filtered);
    }, [filters, mainSearch, hotels]);

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
        <div className='py-8 md:py-16 container mx-auto px-4'>
            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-lg w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-5">
                    {/* Location Input */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Search For Your Stays"
                            value={mainSearch}
                            onChange={(e) => {
                                setMainSearch(e.target.value);
                                updateBookingData({ searchQuery: e.target.value });
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                        />
                    </div>

                    {/* Check-in & Check-out */}
                    <RangePicker
                        placeholder={['Check-in', 'Check-out']}
                        value={bookingData.dateRange}
                        onChange={handleDateChange}
                        style={{ width: '100%' }}
                    />

                    {/* Guests and Rooms */}
                    <div className="space-y-2 h-full flex flex-col">
                        <Select
                            value={`${bookingData.guests.adults} ${bookingData.guests.adults !== 1 ? 'adults' : 'adult'} · ${bookingData.guests.children} ${bookingData.guests.children !== 1 ? 'children' : 'child'} · ${bookingData.guests.rooms} ${bookingData.guests.rooms !== 1 ? 'rooms' : 'room'}`}
                            placeholder="2 adults · 0 children · 1 room"
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
                                                onClick={() => handleGuestsChange('adults', Math.max(1, bookingData.guests.adults - 1))}
                                                disabled={bookingData.guests.adults <= 1}
                                                className="flex items-center justify-center w-8 h-8"
                                            >
                                                -
                                            </Button>
                                            <span className="w-8 text-center">{bookingData.guests.adults}</span>
                                            <Button
                                                onClick={() => handleGuestsChange('adults', bookingData.guests.adults + 1)}
                                                disabled={bookingData.guests.adults >= 8}
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
                                                onClick={() => handleGuestsChange('children', Math.max(0, bookingData.guests.children - 1))}
                                                disabled={bookingData.guests.children <= 0}
                                                className="flex items-center justify-center w-8 h-8"
                                            >
                                                -
                                            </Button>
                                            <span className="w-8 text-center">{bookingData.guests.children}</span>
                                            <Button
                                                onClick={() => handleGuestsChange('children', bookingData.guests.children + 1)}
                                                disabled={bookingData.guests.children >= 4}
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
                                                onClick={() => handleGuestsChange('rooms', Math.max(1, bookingData.guests.rooms - 1))}
                                                disabled={bookingData.guests.rooms <= 1}
                                                className="flex items-center justify-center w-8 h-8"
                                            >
                                                -
                                            </Button>
                                            <span className="w-8 text-center">{bookingData.guests.rooms}</span>
                                            <Button
                                                onClick={() => handleGuestsChange('rooms', bookingData.guests.rooms + 1)}
                                                disabled={bookingData.guests.rooms >= 5}
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
                                {`${bookingData.guests.adults} ${bookingData.guests.adults !== 1 ? 'adults' : 'adult'} · ${bookingData.guests.children} ${bookingData.guests.children !== 1 ? 'children' : 'child'} · ${bookingData.guests.rooms} ${bookingData.guests.rooms !== 1 ? 'rooms' : 'room'}`}
                            </Option>
                        </Select>
                    </div>

                </div>
                {/* Search Button */}
                <div className="">
                    <button 
                        onClick={handleSearch}
                        className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold hover:bg-[#0052A3] transition-colors"
                    >
                        Search
                    </button>
                </div>
            </div>
            {/* Main Content with Sidebar and Hotels */}
            <div id="hotels-results" className="flex flex-col lg:flex-row gap-4 lg:gap-6 py-6 md:py-10">
                {/* Filter Sidebar */}
                <div className="w-full lg:w-80 bg-white p-4 md:p-6 rounded-2xl shadow-lg h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <FilterOutlined className="text-[#0064D2]" />
                            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                        </div>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden text-[#0064D2] font-medium"
                        >
                            {showFilters ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
                        {/* Name Search Filter */}
                        <div>
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
                        <div>
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
                        <div>
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
                </div>

                {/* Hotels Grid */}
                <div className="flex-1">
                    <div className="mb-4">
                        <p className="text-sm md:text-base text-gray-600">
                            Showing {filteredHotels.length} of {hotels.length} hotels
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                        {filteredHotels.map((hotel, index) => (
                            <HotelCard key={index} hotel={hotel} />
                        ))}
                    </div>
                    {filteredHotels.length === 0 && (
                        <div className="col-span-full text-center py-8 md:py-12">
                            <p className="text-gray-500 text-base md:text-lg">No hotels found matching your criteria</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}