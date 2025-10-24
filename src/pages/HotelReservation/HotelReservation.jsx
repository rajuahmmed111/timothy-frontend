import React, { useState, useEffect } from 'react';

import { Select, Space, Slider, Input, Checkbox, Radio, Rate } from 'antd';
import { UserOutlined, TeamOutlined, HomeOutlined, FilterOutlined, SearchOutlined, WifiOutlined, CarOutlined, ShopOutlined, StarOutlined } from '@ant-design/icons';
import { DatePicker, Button } from "antd";
import { useBooking } from '../../context/BookingContext';
import { useLocation, useNavigate } from 'react-router-dom';

// Removed unused dummy image imports
import HotelCard from '../../components/HotelCard/HotelCard';
import { useGetAllHotelRoomsQuery } from '../../redux/api/hotel/hotelApi';



export default function HotelReservation() {
    const { bookingData, updateBookingData, updateGuests } = useBooking();
    const location = useLocation();
    const navigate = useNavigate();

    // Read query params from URL and forward to API
    const searchParams = new URLSearchParams(location.search);
    const appliedSearch = (searchParams.get('searchTerm') || '').toLowerCase();
    const apiParams = {
        searchTerm: searchParams.get('searchTerm') || undefined,
        limit: searchParams.get('limit') || undefined,
        // page is intentionally omitted per recent requirement
        hotelNumberOfRooms: searchParams.get('hotelNumberOfRooms') || undefined,
        hotelNumAdults: searchParams.get('hotelNumAdults') || undefined,
        hotelNumChildren: searchParams.get('hotelNumChildren') || undefined,
        fromDate: searchParams.get('fromDate') || undefined,
        toDate: searchParams.get('toDate') || undefined,
    };

    const { data: hotelRoomsResp } = useGetAllHotelRoomsQuery(apiParams);


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
        // Build query params from current input state only on click
        const params = new URLSearchParams();
        if (mainSearch) params.set('searchTerm', mainSearch);

        const adults = bookingData?.guests?.adults;
        const children = bookingData?.guests?.children;
        const rooms = bookingData?.guests?.rooms;
        if (adults) params.set('hotelNumAdults', String(adults));
        if (children) params.set('hotelNumChildren', String(children));
        if (rooms) params.set('hotelNumberOfRooms', String(rooms));

        const from = bookingData?.dateRange?.[0]?.format?.('YYYY-MM-DD');
        const to = bookingData?.dateRange?.[1]?.format?.('YYYY-MM-DD');
        if (from) params.set('fromDate', from);
        if (to) params.set('toDate', to);

        // Optionally keep existing params like limit
        const current = new URLSearchParams(location.search);
        const limit = current.get('limit');
        if (limit) params.set('limit', limit);

        navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: false });

        // Scroll to results section
        const resultsSection = document.getElementById('hotels-results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const hotels = React.useMemo(() => (
        Array.isArray(hotelRoomsResp?.data?.data) ? hotelRoomsResp.data.data : []
    ), [hotelRoomsResp]);

    // Apply filters to hotels
    React.useEffect(() => {
        let filtered = hotels.filter(hotel => {
            // Price
            const price = Number(hotel?.averagePrice ?? hotel?.room?.[0]?.hotelRoomPriceNight ?? 0);

            // Price range filter
            let priceInRange = true;
            if (filters.priceRange) {
                const [min, max] = filters.priceRange.split('-').map(Number);
                priceInRange = price >= (min || 0) && price <= (Number.isFinite(max) ? max : price);
            }

            // Main search functionality - searches hotelName and city/country
            const name = (hotel?.hotelName || '').toLowerCase();
            const locStr = `${hotel?.hotelCity || ''}, ${hotel?.hotelCountry || ''}`.toLowerCase();
            const mainSearchMatch = appliedSearch === '' || name.includes(appliedSearch) || locStr.includes(appliedSearch);

            // Accommodation type filter (matches backend field)
            const accommodationMatch = filters.accommodationType === '' || 
                hotel?.hotelAccommodationType === filters.accommodationType;

            // Rating filter (use averageRating or first room rating)
            const rating = Number(hotel?.averageRating ?? hotel?.room?.[0]?.hotelRating ?? 0);
            const ratingMatch = filters.reviews.minRating === 0 || rating >= filters.reviews.minRating;

            // Amenities mapping to backend booleans
            const amenityMap = {
                breakfast: !!hotel?.hotelBreakfast,
                kitchen: !!hotel?.hotelKitchen,
                wifi: !!hotel?.hoitelWifi,
                parking: !!hotel?.hotelParking,
                restaurant: !!hotel?.hotelRestaurant,
                gym: !!hotel?.hotelGym,
                pool: !!hotel?.hotelPool,
                spa: !!hotel?.hotelSpa,
                frontDesk24: !!hotel?.hotel24HourFrontDesk,
                airportShuttle: !!hotel?.hotelAirportShuttle,
            };
            const amenitiesMatch = Object.keys(filters.amenities).every(amenity => {
                return !filters.amenities[amenity] || amenityMap[amenity];
            });

            // Preferences mapping (smoking/pets)
            let smokingMatch = true;
            if (filters.preferences.smoking === 'smoking') smokingMatch = !!hotel?.hotelSmoking;
            if (filters.preferences.smoking === 'non-smoking') smokingMatch = !hotel?.hotelSmoking;

            let petsMatch = true;
            if (filters.preferences.pets === 'allowed') petsMatch = !!hotel?.hotelPetsAllowed;
            if (filters.preferences.pets === 'not-allowed') petsMatch = !!hotel?.hotelPetsNotAllowed || !hotel?.hotelPetsAllowed;
            const preferencesMatch = smokingMatch && petsMatch;

            // Location features mapping
            const location_features = {
                waterView: !!hotel?.hotelLocationFeatureWaterView,
                island: !!hotel?.hotelLocationFeatureIsland,
            };
            const locationMatch = Object.keys(filters.location).every(feature => 
                !filters.location[feature] || location_features[feature]
            );

            return priceInRange && mainSearchMatch && accommodationMatch && ratingMatch && amenitiesMatch && preferencesMatch && locationMatch;
        });
        setFilteredHotels(filtered);
    }, [filters, appliedSearch, hotels]);

    // Get unique cities for dropdown
    // const uniqueCities = [...new Set(hotels.map(hotel => {
    //     const city = hotel.location.split(',')[0].trim();
    //     return city;
    // }))];

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
                            value={bookingData.guests.adults > 1 || bookingData.guests.children > 0 || bookingData.guests.rooms > 1 ? 
                                `${bookingData.guests.adults} ${bookingData.guests.adults !== 1 ? 'adults' : 'adult'} · ${bookingData.guests.children} ${bookingData.guests.children !== 1 ? 'children' : 'child'} · ${bookingData.guests.rooms} ${bookingData.guests.rooms !== 1 ? 'rooms' : 'room'}` : 
                                undefined}
                            placeholder="1 adult · 0 children · 1 room"
                            className="w-full h-full [&>div]:h-full [&>div]:py-2.5 [&>div]:px-3 [&_.ant-select-selection-placeholder]:text-gray-400 focus:outline-none focus:border-[#0064D2]"
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
                                    <Radio value="holiday_accommodation">Holiday Accommodation</Radio>
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