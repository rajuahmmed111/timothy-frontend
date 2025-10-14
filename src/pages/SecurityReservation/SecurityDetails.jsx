import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DatePicker, Spin } from "antd";
import { Link } from "react-router-dom";
import { useGetSecurityProtocolsQuery } from "../../redux/api/security/getAllSecurityApi";
import SecurityCard from './SecurityCard';

const { RangePicker } = DatePicker;

export default function SecurityDetails() {
    const [page, setPage] = useState(1);
    const [selectedType, setSelectedType] = useState("All");
    const [dateRange, setDateRange] = useState(null);
    const [providers, setProviders] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    const { data, isLoading, isFetching } = useGetSecurityProtocolsQuery(
        { page, limit: 10 },
        { skip: !hasMore }
    );

    // Update providers when new data is loaded
    useEffect(() => {
        if (data?.data) {
            setProviders(prev => {
                // If it's the first page, replace the data, otherwise append
                if (page === 1) {
                    return data.data;
                }
                return [...prev, ...data.data];
            });
            
            // Check if there are more pages
            if (data.meta && data.meta.totalPages <= page) {
                setHasMore(false);
            }
        }
    }, [data, page]);

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

    // Filter providers based on selected type
    const filteredProviders = selectedType === "All"
        ? providers
        : providers.filter(provider => provider.type === selectedType);

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        setPage(1);
        setHasMore(true);
        setProviders([]);
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
                    {/* Security Type */}
                    <div className="space-y-2">
                        <select 
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                            value={selectedType}
                            onChange={handleTypeChange}
                        >
                            <option value="All">All Security Types</option>
                            <option value="Personal Bodyguard">Personal Bodyguard</option>
                            <option value="Security Guard">Security Guard</option>
                            <option value="Executive Protections">Executive Protections</option>
                            <option value="Event Security">Event Security</option>
                        </select>
                    </div>
                </div>
                {/* Search Button */}
                <div>
                    <Link to="/security-details" className="w-full">
                        <button className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
                            Search
                        </button>
                    </Link>
                </div>
            </div>
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto py-10">
                {filteredProviders.map((securityProvider, index) => (
                    <SecurityCard 
                        key={`${securityProvider.id}-${index}`} 
                        securityProvider={securityProvider} 
                    />
                ))}
                
                {/* Loading spinner */}
                {(isLoading || isFetching) && (
                    <div className="col-span-full flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                )}
                
                {/* Intersection observer target */}
                <div ref={loader} style={{ height: '20px' }} />
                
                {/* No results message */}
                {!isLoading && filteredProviders.length === 0 && (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">No security providers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}