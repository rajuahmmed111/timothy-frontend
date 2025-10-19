import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DatePicker, Spin } from "antd";
import CarCard from './CarCard';
import { useGetAllCarsQuery } from "../../redux/api/car/getAllCarsApi";

const { RangePicker } = DatePicker;

export default function CarDetails() {
    const [dateRange, setDateRange] = useState(null);
    const [page, setPage] = useState(1);
    const [cars, setCars] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    const { data: carsData, isLoading, isFetching } = useGetAllCarsQuery(
        { page, limit: 8 },
        { skip: !hasMore }
    );

    // Transform car data to match the expected car card props
    const transformCarData = (car) => ({
        id: car.id,
        name: car.car_Rental?.carName || car.carModel,
        location: `${car.carCity}, ${car.carCountry}`,
        image: car.carImages?.[0] || "/car/default-car.png",
        price: `$${car.carPriceDay}`,
        rating: parseFloat(car.carRating) || 4.5,
        type: car.carType,
        seats: car.carSeats,
        transmission: car.carTransmission,
        fuelType: car.fuelType,
        discount: car.discount,
        isAvailable: car.isBooked === "AVAILABLE",
    });

    // Update cars when new data is loaded
    useEffect(() => {
        if (carsData?.data?.data) {
            setCars(prev => {
                // If it's the first page, replace the data, otherwise append
                if (page === 1) {
                    return carsData.data.data.map(transformCarData);
                }
                return [...prev, ...carsData.data.data.map(transformCarData)];
            });
            
            // Check if there are more pages
            if (carsData.meta && carsData.meta.totalPages <= page) {
                setHasMore(false);
            }
        }
    }, [carsData, page]);

    // Handle scroll for infinite loading
    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [isFetching, hasMore]);

    // Set up intersection observer
    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };

        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);

        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [handleObserver]);

    const handleSearch = () => {
        // Reset pagination and fetch first page when search is performed
        setPage(1);
        setCars([]);
        setHasMore(true);
    };
       



    return (
        <div className='py-16 container mx-auto'>
            <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    {/* Location Input */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Find Location"
                            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                        />
                    </div>
                    {/* Start Date & End Date */}
                    <RangePicker
                        placeholder={['Start Date', 'End Date']}
                        value={dateRange}
                        onChange={setDateRange}
                        style={{ width: '100%' }}
                    />
                    {/* Car Type */}
                    <div className="space-y-2">
                        <select className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]">
                            <option value="">Select Car Type</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Sports">Sports</option>
                        </select>
                    </div>
                </div>
                {/* Search Button */}
                <div>
                    <button 
                        className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto py-10">
                {cars.map((car, index) => (
                    <CarCard key={`${car.id}-${index}`} car={car} />
                ))}
            </div>

            {/* Loading spinner */}
            {(isLoading || isFetching) && (
                <div className="col-span-full flex justify-center py-8">
                    <Spin size="large" />
                </div>
            )}
            
            {/* Intersection observer target */}
            <div ref={loader} style={{ height: '20px' }} />
            
            {/* No results message */}
            {!isLoading && cars.length === 0 && (
                <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No cars found.</p>
                </div>
            )}
        </div>
    );
}