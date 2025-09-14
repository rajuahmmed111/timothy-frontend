import React, { useState, useEffect } from 'react';

import { Select, Space, Slider, Input, Checkbox, Radio, Rate } from 'antd';
import { UserOutlined, TeamOutlined, HomeOutlined, FilterOutlined, SearchOutlined, WifiOutlined, CarOutlined, ShopOutlined, StarOutlined } from '@ant-design/icons';
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
        priceRange: '',
        accommodationType: '',
        amenities: {
            breakfast: false,
            kitchen: false,
            wifi: false,
            parking: false,
            restaurant: false,
            gym: false,
            pool: false,
            spa: false,
            frontDesk24: false,
            airportShuttle: false
        },
        preferences: {
            smoking: '',
            pets: ''
        },
        location: {
            waterView: false,
            island: false
        },
        reviews: {
            minRating: 0
        }
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
            type: "hotel",
            amenities: {
                breakfast: true,
                kitchen: false,
                wifi: true,
                parking: true,
                restaurant: true,
                gym: true,
                pool: false,
                spa: true,
                frontDesk24: true,
                airportShuttle: true
            },
            preferences: {
                smoking: "non-smoking",
                pets: "not-allowed"
            },
            location_features: {
                waterView: false,
                island: false
            }
        },
        {
            name: "Budget Inn",
            location: "Los Angeles, USA",
            image: ing2,
            price: "$89",
            rating: 3,
            type: "hotel",
            amenities: {
                breakfast: false,
                kitchen: false,
                wifi: true,
                parking: true,
                restaurant: false,
                gym: false,
                pool: false,
                spa: false,
                frontDesk24: false,
                airportShuttle: false
            },
            preferences: {
                smoking: "smoking",
                pets: "allowed"
            },
            location_features: {
                waterView: false,
                island: false
            }
        },
        {
            name: "Majestic Serenity Palace",
            location: "Miami, USA",
            image: ing3,
            price: "$425",
            rating: 5,
            type: "hotel",
            amenities: {
                breakfast: true,
                kitchen: false,
                wifi: true,
                parking: true,
                restaurant: true,
                gym: true,
                pool: true,
                spa: true,
                frontDesk24: true,
                airportShuttle: true
            },
            preferences: {
                smoking: "non-smoking",
                pets: "not-allowed"
            },
            location_features: {
                waterView: true,
                island: false
            }
        },
        {
            name: "Grand Central Hotel",
            location: "Chicago, USA",
            image: ing4,
            price: "$320",
            rating: 4,
            type: "hotel",
            amenities: {
                breakfast: true,
                kitchen: false,
                wifi: true,
                parking: false,
                restaurant: true,
                gym: true,
                pool: false,
                spa: false,
                frontDesk24: true,
                airportShuttle: false
            },
            preferences: {
                smoking: "non-smoking",
                pets: "allowed"
            },
            location_features: {
                waterView: false,
                island: false
            }
        },
        {
            name: "Ocean View Resort",
            location: "Miami, USA",
            image: ing1,
            price: "$275",
            rating: 4,
            type: "hotel",
            amenities: {
                breakfast: true,
                kitchen: false,
                wifi: true,
                parking: true,
                restaurant: true,
                gym: false,
                pool: true,
                spa: false,
                frontDesk24: true,
                airportShuttle: false
            },
            preferences: {
                smoking: "non-smoking",
                pets: "allowed"
            },
            location_features: {
                waterView: true,
                island: false
            }
        },
        {
            name: "City Center Lodge",
            location: "Chicago, USA",
            image: ing2,
            price: "$150",
            rating: 3,
            type: "hotel",
            amenities: {
                breakfast: false,
                kitchen: false,
                wifi: true,
                parking: false,
                restaurant: false,
                gym: false,
                pool: false,
                spa: false,
                frontDesk24: false,
                airportShuttle: false
            },
            preferences: {
                smoking: "smoking",
                pets: "allowed"
            },
            location_features: {
                waterView: false,
                island: false
            }
        },
        {
            name: "Royal Paradise Hotel",
            location: "Las Vegas, USA",
            image: ing3,
            price: "$199",
            rating: 4,
            type: "hotel",
            amenities: {
                breakfast: false,
                kitchen: false,
                wifi: true,
                parking: true,
                restaurant: true,
                gym: true,
                pool: true,
                spa: true,
                frontDesk24: true,
                airportShuttle: true
            },
            preferences: {
                smoking: "smoking",
                pets: "not-allowed"
            },
            location_features: {
                waterView: false,
                island: false
            }
        },
        {
            name: "Sunset Boulevard Inn",
            location: "Los Angeles, USA",
            image: ing4,
            price: "$245",
            rating: 4,
            type: "hotel",
            amenities: {
                breakfast: true,
                kitchen: false,
                wifi: true,
                parking: true,
                restaurant: false,
                gym: false,
                pool: false,
                spa: false,
                frontDesk24: false,
                airportShuttle: false
            },
            preferences: {
                smoking: "non-smoking",
                pets: "allowed"
            },
            location_features: {
                waterView: false,
                island: false
            }
        },
        {
            name: "Metropolitan Luxury Suites",
            location: "New York, USA",
            image: ing1,
            price: "$495",
            rating: 5,
            type: "apartment",
            amenities: {
                breakfast: false,
                kitchen: true,
                wifi: true,
                parking: true,
                restaurant: false,
                gym: true,
                pool: false,
                spa: false,
                frontDesk24: true,
                airportShuttle: true
            },
            preferences: {
                smoking: "non-smoking",
                pets: "allowed"
            },
            location_features: {
                waterView: false,
                island: false
            }
        },
        {
            name: "Desert Oasis Hotel",
            location: "Las Vegas, USA",
            image: ing2,
            price: "$135",
            rating: 3,
            type: "hotel",
            amenities: {
                breakfast: false,
                kitchen: false,
                wifi: true,
                parking: true,
                restaurant: false,
                gym: false,
                pool: true,
                spa: false,
                frontDesk24: false,
                airportShuttle: false
            },
            preferences: {
                smoking: "smoking",
                pets: "allowed"
            },
            location_features: {
                waterView: false,
                island: false
            }
        },
        {
            name: "Beachfront Paradise",
            location: "Miami, USA",
            image: ing3,
            price: "$380",
            rating: 5,
            type: "hotel",
            amenities: {
                breakfast: true,
                kitchen: false,
                wifi: true,
                parking: true,
                restaurant: true,
                gym: true,
                pool: true,
                spa: true,
                frontDesk24: true,
                airportShuttle: false
            },
            preferences: {
                smoking: "non-smoking",
                pets: "not-allowed"
            },
            location_features: {
                waterView: true,
                island: true
            }
        },
        {
            name: "Downtown Business Hotel",
            location: "Chicago, USA",
            image: ing4,
            price: "$210",
            rating: 4,
            type: "hotel",
            amenities: {
                breakfast: true,
                kitchen: false,
                wifi: true,
                parking: false,
                restaurant: true,
                gym: true,
                pool: false,
                spa: false,
                frontDesk24: true,
                airportShuttle: true
            },
            preferences: {
                smoking: "non-smoking",
                pets: "not-allowed"
            },
            location_features: {
                waterView: false,
                island: false
            }
        }
    ];

    // Apply filters to hotels
    React.useEffect(() => {
        let filtered = hotels.filter(hotel => {
            const price = parseInt(hotel.price.replace('$', ''));
            
            // Price range filter
            let priceInRange = true;
            if (filters.priceRange) {
                const [min, max] = filters.priceRange.split('-').map(Number);
                priceInRange = price >= min && price <= max;
            }
            
            // Main search functionality - searches both name and location
            const mainSearchMatch = mainSearch === '' || 
                hotel.name.toLowerCase().includes(mainSearch.toLowerCase()) ||
                hotel.location.toLowerCase().includes(mainSearch.toLowerCase());
            
            // Accommodation type filter
            const accommodationMatch = filters.accommodationType === '' || 
                hotel.type === filters.accommodationType;
            
            // Rating filter
            const ratingMatch = filters.reviews.minRating === 0 || hotel.rating >= filters.reviews.minRating;
            
            // Amenities filter
            const amenitiesMatch = Object.keys(filters.amenities).every(amenity => 
                !filters.amenities[amenity] || hotel.amenities[amenity]
            );
            
            // Preferences filter
            const preferencesMatch = 
                (filters.preferences.smoking === '' || hotel.preferences.smoking === filters.preferences.smoking) &&
                (filters.preferences.pets === '' || hotel.preferences.pets === filters.preferences.pets);
            
            // Location features filter
            const locationMatch = Object.keys(filters.location).every(feature => 
                !filters.location[feature] || hotel.location_features[feature]
            );
            
            return priceInRange && mainSearchMatch && accommodationMatch && ratingMatch && amenitiesMatch && preferencesMatch && locationMatch;
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

                        {/* Price Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                            <Select
                                placeholder="Select price range"
                                value={filters.priceRange}
                                onChange={(value) => handleFilterChange('priceRange', value)}
                                className="w-full"
                                allowClear
                            >
                                <Option value="0-100">$0 - $100</Option>
                                <Option value="100-200">$100 - $200</Option>
                                <Option value="200-300">$200 - $300</Option>
                                <Option value="300-400">$300 - $400</Option>
                                <Option value="400-500">$400 - $500</Option>
                                <Option value="500-600">$500 - $600</Option>
                            </Select>
                        </div>

                        {/* Accommodation Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Type</label>
                            <Radio.Group
                                value={filters.accommodationType}
                                onChange={(e) => handleFilterChange('accommodationType', e.target.value)}
                                className="w-full"
                            >
                                <div className="space-y-2">
                                    <Radio value="">All</Radio>
                                    <Radio value="hotel">Hotels</Radio>
                                    <Radio value="apartment">Apartments</Radio>
                                </div>
                            </Radio.Group>
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                            <div className="space-y-2">
                                <Checkbox
                                    checked={filters.amenities.breakfast}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, breakfast: e.target.checked })}
                                >
                                    Breakfast included
                                </Checkbox>
                                <Checkbox
                                    checked={filters.amenities.kitchen}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, kitchen: e.target.checked })}
                                >
                                    Kitchen
                                </Checkbox>
                                <Checkbox
                                    checked={filters.amenities.wifi}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, wifi: e.target.checked })}
                                >
                                    <WifiOutlined className="mr-1" /> Free WiFi
                                </Checkbox>
                                <Checkbox
                                    checked={filters.amenities.parking}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, parking: e.target.checked })}
                                >
                                    <CarOutlined className="mr-1" /> Parking
                                </Checkbox>
                                <Checkbox
                                    checked={filters.amenities.restaurant}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, restaurant: e.target.checked })}
                                >
                                    <ShopOutlined className="mr-1" /> Restaurant
                                </Checkbox>
                                <Checkbox
                                    checked={filters.amenities.gym}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, gym: e.target.checked })}
                                >
                                    Gym
                                </Checkbox>
                                <Checkbox
                                    checked={filters.amenities.pool}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, pool: e.target.checked })}
                                >
                                    Swimming pool
                                </Checkbox>
                                <Checkbox
                                    checked={filters.amenities.spa}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, spa: e.target.checked })}
                                >
                                    Spa
                                </Checkbox>
                                <Checkbox
                                    checked={filters.amenities.frontDesk24}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, frontDesk24: e.target.checked })}
                                >
                                    24-hour front desk
                                </Checkbox>
                                <Checkbox
                                    checked={filters.amenities.airportShuttle}
                                    onChange={(e) => handleFilterChange('amenities', { ...filters.amenities, airportShuttle: e.target.checked })}
                                >
                                    Airport shuttle
                                </Checkbox>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Smoking</label>
                            <Radio.Group
                                value={filters.preferences.smoking}
                                onChange={(e) => handleFilterChange('preferences', { ...filters.preferences, smoking: e.target.value })}
                                className="w-full"
                            >
                                <div className="space-y-2">
                                    <Radio value="">No preference</Radio>
                                    <Radio value="non-smoking">Non-smoking</Radio>
                                    <Radio value="smoking">Smoking allowed</Radio>
                                </div>
                            </Radio.Group>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pets</label>
                            <Radio.Group
                                value={filters.preferences.pets}
                                onChange={(e) => handleFilterChange('preferences', { ...filters.preferences, pets: e.target.value })}
                                className="w-full"
                            >
                                <div className="space-y-2">
                                    <Radio value="">No preference</Radio>
                                    <Radio value="allowed">Pets allowed</Radio>
                                    <Radio value="not-allowed">Pets not allowed</Radio>
                                </div>
                            </Radio.Group>
                        </div>

                        {/* Location Features */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Location Features</label>
                            <div className="space-y-2">
                                <Checkbox
                                    checked={filters.location.waterView}
                                    onChange={(e) => handleFilterChange('location', { ...filters.location, waterView: e.target.checked })}
                                >
                                    Water view
                                </Checkbox>
                                <Checkbox
                                    checked={filters.location.island}
                                    onChange={(e) => handleFilterChange('location', { ...filters.location, island: e.target.checked })}
                                >
                                    Island
                                </Checkbox>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                            <Rate
                                value={filters.reviews.minRating}
                                onChange={(value) => handleFilterChange('reviews', { ...filters.reviews, minRating: value })}
                                allowClear
                                className="text-yellow-400"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                {filters.reviews.minRating > 0 ? `${filters.reviews.minRating} stars and above` : 'Any rating'}
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        <Button
                            onClick={() => setFilters({
                                priceRange: '',
                                accommodationType: '',
                                amenities: {
                                    breakfast: false,
                                    kitchen: false,
                                    wifi: false,
                                    parking: false,
                                    restaurant: false,
                                    gym: false,
                                    pool: false,
                                    spa: false,
                                    frontDesk24: false,
                                    airportShuttle: false
                                },
                                preferences: {
                                    smoking: '',
                                    pets: ''
                                },
                                location: {
                                    waterView: false,
                                    island: false
                                },
                                reviews: {
                                    minRating: 0
                                }
                            })}
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