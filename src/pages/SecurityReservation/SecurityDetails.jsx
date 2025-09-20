import React, { useEffect, useMemo, useState } from 'react';

import ing1 from "/SecurityProviders/1.png"
import ing2 from "/SecurityProviders/2.png"
import ing4 from "/SecurityProviders/4.png"
import ing5 from "/SecurityProviders/5.png"
import ing6 from "/SecurityProviders/6.png"

import SecurityCard from './SecurityCard';
import { DatePicker } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom"
import dayjs from 'dayjs';

export default function SecurityDetails() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;

    const [location, setLocation] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [dateRange, setDateRange] = useState(null);

    // Initialize state from URL params on mount
    useEffect(() => {
        const loc = searchParams.get('location') || "";
        const type = searchParams.get('type') || "All";
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        setLocation(loc);
        setSelectedType(type);
        if (start && end) {
            const startDay = dayjs(start);
            const endDay = dayjs(end);
            if (startDay.isValid() && endDay.isValid()) {
                setDateRange([startDay, endDay]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const securityProviders = [
        {
            name: "Ava Martinez",
            location: "Los Angeles, USA",
            image: ing1,
            price: "$520",
            rating: 5,
            type: "Personal Bodyguard",
        },
        {
            name: "Noah Williams",
            location: "Chicago, USA",
            image: ing2,
            price: "$95",
            rating: 4,
            type: "Security Guard",
        },
        {
            name: "Mia Chen",
            location: "San Francisco, USA",
            image: ing5,
            price: "$460",
            rating: 5,
            type: "Executive Protections",
        },
        {
            name: "Liam Johnson",
            location: "Austin, USA",
            image: ing6,
            price: "$480",
            rating: 5,
            type: "Event Security",
        },
        {
            name: "Olivia Garcia",
            location: "Miami, USA",
            image: ing4,
            price: "$510",
            rating: 4,
            type: "Personal Bodyguard",
        },
        {
            name: "Ethan Brown",
            location: "Seattle, USA",
            image: ing2,
            price: "$110",
            rating: 4,
            type: "Security Guard",
        },
        {
            name: "Sophia Kim",
            location: "Vancouver, Canada",
            image: ing5,
            price: "$430",
            rating: 5,
            type: "Executive Protections",
        },
        {
            name: "James Anderson",
            location: "London, UK",
            image: ing6,
            price: "$455",
            rating: 5,
            type: "Event Security",
        },
        {
            name: "Isabella Rossi",
            location: "Rome, Italy",
            image: ing1,
            price: "$540",
            rating: 5,
            type: "Personal Bodyguard",
        },
        {
            name: "Lucas Silva",
            location: "Lisbon, Portugal",
            image: ing2,
            price: "$105",
            rating: 3,
            type: "Security Guard",
        },
        {
            name: "Amelia Thompson",
            location: "Dublin, Ireland",
            image: ing5,
            price: "$445",
            rating: 4,
            type: "Executive Protections",
        },
        {
            name: "Benjamin Lee",
            location: "Sydney, Australia",
            image: ing4,
            price: "$470",
            rating: 5,
            type: "Event Security",
        },
    ]

    // Filter security providers based on selected type
    const filteredProviders = useMemo(() => {
        return selectedType === "All"
            ? securityProviders
            : securityProviders.filter(provider => provider.type === selectedType);
    }, [selectedType]);

    const onSearch = () => {
        const params = new URLSearchParams();
        if (location) params.set('location', location);
        if (selectedType && selectedType !== 'All') params.set('type', selectedType);
        if (dateRange && dateRange[0] && dateRange[1]) {
            params.set('start', dateRange[0].format('YYYY-MM-DD'));
            params.set('end', dateRange[1].format('YYYY-MM-DD'));
        }
        const qs = params.toString();
        navigate(`/security-details${qs ? `?${qs}` : ''}`);
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
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
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
                            value={selectedType === 'All' ? '' : selectedType}
                            onChange={(e) => setSelectedType(e.target.value || 'All')}
                        >
                            <option value="" className="text-slate-50">Select Security Type</option>
                            <option value="Personal Bodyguard">Personal Bodyguard</option>
                            <option value="Security Guard">Security Guard</option>
                            <option value="Executive Protections">Executive Protections</option>
                            <option value="Event Security">Event Security</option>
                        </select>
                    </div>

                </div>
                {/* Search Button */}
                <div className="">
                    <button onClick={onSearch} className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
                        Search
                    </button>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto py-10">
                {filteredProviders.map((securityProvider, index) => (
                    <SecurityCard key={index} securityProvider={securityProvider} />
                ))}
            </div>
        </div>
    )
}