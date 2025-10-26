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
    const currentPage = Number(searchParams.get('page') || 1);
    const currentLimit = Number(searchParams.get('limit') || 12);
    const apiParams = {
        searchTerm: searchParams.get('searchTerm') || undefined,
        limit: searchParams.get('limit') || undefined,
        page: searchParams.get('page') || undefined,
        hotelNumberOfRooms: searchParams.get('hotelNumberOfRooms') || undefined,
        hotelNumAdults: searchParams.get('hotelNumAdults') || undefined,
        hotelNumChildren: searchParams.get('hotelNumChildren') || undefined,
        fromDate: searchParams.get('fromDate') || undefined,
        toDate: searchParams.get('toDate') || undefined,
        // URL-driven filter params
        hotelAccommodationType: searchParams.get('hotelAccommodationType') || undefined,
        hotelRating: searchParams.get('hotelRating') || undefined,
        minPrice: searchParams.get('minPrice') || undefined,
        maxPrice: searchParams.get('maxPrice') || undefined,
        hotelBreakfast: searchParams.get('hotelBreakfast') || undefined,
        hotelKitchen: searchParams.get('hotelKitchen') || undefined,
        hoitelWifi: searchParams.get('hoitelWifi') || undefined,
        hotelParking: searchParams.get('hotelParking') || undefined,
        hotelRestaurant: searchParams.get('hotelRestaurant') || undefined,
        hotelGym: searchParams.get('hotelGym') || undefined,
        hotelPool: searchParams.get('hotelPool') || undefined,
        hotelSpa: searchParams.get('hotelSpa') || undefined,
        hotel24HourFrontDesk: searchParams.get('hotel24HourFrontDesk') || undefined,
        hotelAirportShuttle: searchParams.get('hotelAirportShuttle') || undefined,
        hotelSmoking: searchParams.get('hotelSmoking') || undefined,
        hotelNoNSmoking: searchParams.get('hotelNoNSmoking') || undefined,
        hotelNoSmokingPreference: searchParams.get('hotelNoSmokingPreference') || undefined,
        hotelPetsAllowed: searchParams.get('hotelPetsAllowed') || undefined,
        hotelPetsNotAllowed: searchParams.get('hotelPetsNotAllowed') || undefined,
        hotelNoPetsPreferences: searchParams.get('hotelNoPetsPreferences') || undefined,
        hotelLocationFeatureWaterView: searchParams.get('hotelLocationFeatureWaterView') || undefined,
        hotelLocationFeatureIsland: searchParams.get('hotelLocationFeatureIsland') || undefined,
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

    // Keep Accommodation Type filter in sync with URL param
    useEffect(() => {
        const typeFromUrl = new URLSearchParams(location.search).get('hotelAccommodationType') || '';
        if (typeFromUrl !== filters.accommodationType) {
            setFilters(prev => ({ ...prev, accommodationType: typeFromUrl }));
        }
    }, [location.search, filters.accommodationType]);

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
        const defAdults = 1;
        const defChildren = 0;
        const defRooms = 1;
        if (typeof adults === 'number' && adults !== defAdults) params.set('hotelNumAdults', String(adults));
        if (typeof children === 'number' && children > defChildren) params.set('hotelNumChildren', String(children));
        if (typeof rooms === 'number' && rooms !== defRooms) params.set('hotelNumberOfRooms', String(rooms));

        const from = bookingData?.dateRange?.[0]?.format?.('YYYY-MM-DD');
        const to = bookingData?.dateRange?.[1]?.format?.('YYYY-MM-DD');
        if (from) params.set('fromDate', from);
        if (to) params.set('toDate', to);

        // Include accommodation type if selected
        if (filters?.accommodationType) {
            params.set('hotelAccommodationType', filters.accommodationType);
        }

        // Optionally keep existing params like limit/page
        const current = new URLSearchParams(location.search);
        const limit = current.get('limit');
        const page = current.get('page');
        if (limit) params.set('limit', limit);
        if (page) params.set('page', page);

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

    // Derive pagination meta (fallbacks if API doesn't return meta)
    const totalFromApi = Number(hotelRoomsResp?.data?.meta?.total || 0);
    const total = Number.isFinite(totalFromApi) && totalFromApi > 0 ? totalFromApi : hotels.length;
    const limitVal = Number.isFinite(currentLimit) && currentLimit > 0 ? currentLimit : 12;
    const totalPages = Math.max(1, Math.ceil(total / limitVal));

    // Helper to update URL params
    const updateQueryParams = (updates = {}) => {
        const params = new URLSearchParams(location.search);
        Object.entries(updates).forEach(([k, v]) => {
            if (v === undefined || v === null || v === '') params.delete(k);
            else params.set(k, String(v));
        });
        navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: false });
    };
    const setBooleanParam = (key, checked) => {
        updateQueryParams({ [key]: checked ? true : '' });
    };
    const setPriceRangeParams = (rangeStr) => {
        if (!rangeStr) {
            updateQueryParams({ minPrice: '', maxPrice: '' });
            return;
        }
        const [min, max] = String(rangeStr).split('-');
        updateQueryParams({ minPrice: min || '', maxPrice: max || '' });
    };
    const setRatingParam = (val) => {
        const v = Number(val || 0);
        updateQueryParams({ hotelRating: v > 0 ? v : '' });
    };
    const setSmokingParams = (val) => {
        // Clear all smoking-related params first
        updateQueryParams({ hotelSmoking: '', hotelNoNSmoking: '', hotelNoSmokingPreference: '' });
        if (val === 'smoking') updateQueryParams({ hotelSmoking: true });
        if (val === 'non-smoking') updateQueryParams({ hotelNoNSmoking: true });
        // No preference => no params
    };
    const setPetsParams = (val) => {
        // Clear all pets-related params first
        updateQueryParams({ hotelPetsAllowed: '', hotelPetsNotAllowed: '', hotelNoPetsPreferences: '' });
        if (val === 'allowed') updateQueryParams({ hotelPetsAllowed: true });
        if (val === 'not-allowed') updateQueryParams({ hotelPetsNotAllowed: true });
        // No preference => no params
    };
    const handlePageChange = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        updateQueryParams({ page: nextPage });
        const resultsSection = document.getElementById('hotels-results');
        if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
    };
    // const handleLimitChange = (nextLimit) => {
    //     updateQueryParams({ limit: nextLimit, page: 1 });
    //     const resultsSection = document.getElementById('hotels-results');
    //     if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
    // };

    // URL-driven filtering: mirror API results to displayed list
    React.useEffect(() => {
        setFilteredHotels(hotels);
    }, [hotels]);

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
onChange={(value) => { handleFilterChange('priceRange', value); setPriceRangeParams(value || ''); }}
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
    onChange={(e) => { 
      handleFilterChange('accommodationType', e.target.value); 
      updateQueryParams({ hotelAccommodationType: e.target.value || '' }); 
    }}
    className="w-full"
  >
    <div className="space-y-2">
      <Radio value="">All</Radio>
      <Radio value="hotel">Hotels</Radio>
      <Radio value="apartment">Apartments</Radio>
      <Radio value="holiday-accommodation">Holiday Accommodation</Radio>
    </div>
  </Radio.Group>
</div>

{/* Amenities */}
<div>
<label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
<div className="space-y-2">
<Checkbox
checked={filters.amenities.breakfast}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, breakfast: e.target.checked }); setBooleanParam('hotelBreakfast', e.target.checked); }}
>
Breakfast included
</Checkbox>
<Checkbox
checked={filters.amenities.kitchen}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, kitchen: e.target.checked }); setBooleanParam('hotelKitchen', e.target.checked); }}
>
Kitchen
</Checkbox>
<Checkbox
checked={filters.amenities.wifi}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, wifi: e.target.checked }); setBooleanParam('hoitelWifi', e.target.checked); }}
>
<WifiOutlined className="mr-1" /> Free WiFi
</Checkbox>
<Checkbox
checked={filters.amenities.parking}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, parking: e.target.checked }); setBooleanParam('hotelParking', e.target.checked); }}
>
<CarOutlined className="mr-1" /> Parking
</Checkbox>
<Checkbox
checked={filters.amenities.restaurant}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, restaurant: e.target.checked }); setBooleanParam('hotelRestaurant', e.target.checked); }}
>
<ShopOutlined className="mr-1" /> Restaurant
</Checkbox>
<Checkbox
checked={filters.amenities.gym}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, gym: e.target.checked }); setBooleanParam('hotelGym', e.target.checked); }}
>
Gym
</Checkbox>
<Checkbox
checked={filters.amenities.pool}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, pool: e.target.checked }); setBooleanParam('hotelPool', e.target.checked); }}
>
Swimming pool
</Checkbox>
<Checkbox
checked={filters.amenities.spa}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, spa: e.target.checked }); setBooleanParam('hotelSpa', e.target.checked); }}
>
Spa
</Checkbox>
<Checkbox
checked={filters.amenities.frontDesk24}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, frontDesk24: e.target.checked }); setBooleanParam('hotel24HourFrontDesk', e.target.checked); }}
>
24-hour front desk
</Checkbox>
<Checkbox
checked={filters.amenities.airportShuttle}
onChange={(e) => { handleFilterChange('amenities', { ...filters.amenities, airportShuttle: e.target.checked }); setBooleanParam('hotelAirportShuttle', e.target.checked); }}
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
onChange={(e) => { handleFilterChange('preferences', { ...filters.preferences, smoking: e.target.value }); setSmokingParams(e.target.value); }}
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
onChange={(e) => { handleFilterChange('preferences', { ...filters.preferences, pets: e.target.value }); setPetsParams(e.target.value); }}
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
onChange={(e) => { handleFilterChange('location', { ...filters.location, waterView: e.target.checked }); setBooleanParam('hotelLocationFeatureWaterView', e.target.checked); }}
>
Water view
</Checkbox>
<Checkbox
checked={filters.location.island}
onChange={(e) => { handleFilterChange('location', { ...filters.location, island: e.target.checked }); setBooleanParam('hotelLocationFeatureIsland', e.target.checked); }}
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
onChange={(value) => { handleFilterChange('reviews', { ...filters.reviews, minRating: value }); setRatingParam(value); }}
allowClear
className="text-yellow-400"
/>
<div className="text-xs text-gray-500 mt-1">
{filters.reviews.minRating > 0 ? `${filters.reviews.minRating} stars and above` : 'Any rating'}
</div>
</div>

{/* Clear Filters Button */}
<Button
onClick={() => {
updateQueryParams({
hotelRating: '',
minPrice: '',
maxPrice: '',
hotelBreakfast: '',
hotelKitchen: '',
hoitelWifi: '',
hotelParking: '',
hotelRestaurant: '',
hotelGym: '',
hotelPool: '',
hotelSpa: '',
hotel24HourFrontDesk: '',
hotelAirportShuttle: '',
hotelSmoking: '',
hotelNoNSmoking: '',
hotelNoSmokingPreference: '',
hotelPetsAllowed: '',
hotelPetsNotAllowed: '',
hotelNoPetsPreferences: '',
hotelLocationFeatureWaterView: '',
hotelLocationFeatureIsland: '',
hotelAccommodationType: '',
page: 1,
});
setFilters({
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
}}
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
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 min-h-screen md:min-h-[600px] ">
{filteredHotels.slice((currentPage - 1) * limitVal, currentPage * limitVal).map((hotel, index) => {
const firstRoom = hotel?.room?.[0] || {};
const image = firstRoom?.hotelRoomImages?.[0] || hotel?.businessLogo || hotel?.coverImage || '';
const name = hotel?.hotelName || hotel?.name || 'Unnamed Hotel';
const locationStr = `${hotel?.hotelCity || ''}${hotel?.hotelCity && hotel?.hotelCountry ? ', ' : ''}${hotel?.hotelCountry || ''}`;
const priceNum = Number(hotel?.averagePrice ?? firstRoom?.hotelRoomPriceNight ?? 0);
const ratingNum = Number(hotel?.averageRating ?? firstRoom?.hotelRating ?? 0);
const discountPct = Number(firstRoom?.discount ?? hotel?.discount ?? 0);
const cardModel = {
id: hotel?.id,
image,
name,
location: locationStr,
price: priceNum > 0 ? priceNum : undefined,
discount: discountPct > 0 ? discountPct : 0,
rating: ratingNum,
raw: hotel,
};
return <HotelCard key={index} hotel={cardModel} />
})}
</div>

{filteredHotels.length === 0 && (
<div className="col-span-full text-center py-8 md:py-12">
<p className="text-gray-500 text-base md:text-lg">No hotels found matching your criteria</p>
<p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
</div>
)}

{/* Pagination Controls */}
<div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
<div className="flex items-center gap-2">
<button
onClick={() => handlePageChange(currentPage - 1)}
disabled={currentPage <= 1}
className="px-3 py-2 rounded-md border text-sm disabled:opacity-50"
>
Prev
</button>
<span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
<button
onClick={() => handlePageChange(currentPage + 1)}
disabled={currentPage >= totalPages}
className="px-3 py-2 rounded-md border text-sm disabled:opacity-50"
>
Next
</button>
</div>
{/* Per page selector removed; default is 12 */}
</div>
</div>
</div>
</div>
)
}