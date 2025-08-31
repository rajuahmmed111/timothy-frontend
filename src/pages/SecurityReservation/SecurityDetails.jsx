import React, { useState } from 'react';

import ing1 from "/SecurityProviders/1.png"
import ing2 from "/SecurityProviders/2.png"
import ing4 from "/SecurityProviders/4.png"
import ing5 from "/SecurityProviders/5.png"
import ing6 from "/SecurityProviders/6.png"

import SecurityCard from './SecurityCard';
import { DatePicker } from "antd";
import { Link } from "react-router-dom"



export default function SecurityDetails() {
    const [selectedType, setSelectedType] = useState("All");
    const { RangePicker } = DatePicker;
    const [dateRange, setDateRange] = useState(null);
    const securityProviders = [
        {
            name: "Jacob Jones",
            location: "New York, USA",
            image: ing1,
            price: "$500",
            rating: 5,
            type: "Personal Bodyguard",
        },
        {
            name: "Ralph Edwards",
            location: "New York, USA",
            image: ing2,
            price: "$75",
            rating: 4,
            type: "Security Guard",
        },
        {
            name: "Leslie Alexander",
            location: "New York, USA",
            image: ing5,
            price: "$425",
            rating: 5,
            type: "Executive Protections",
        },
        {
            name: "Savannah Nguyen",
            location: "New York, USA",
            image: ing6,
            price: "$450",
            rating: 5,
            type: "Event Security",
        },
        {
            name: "Jacob Jones",
            location: "New York, USA",
            image: ing1,
            price: "$500",
            rating: 5,
            type: "Personal Bodyguard",
        },
        {
            name: "Ralph Edwards",
            location: "New York, USA",
            image: ing2,
            price: "$75",
            rating: 4,
            type: "Security Guard",
        },
        {
            name: "Leslie Alexander",
            location: "New York, USA",
            image: ing6,
            price: "$425",
            rating: 5,
            type: "Executive Protections",
        },
        {
            name: "Savannah Nguyen",
            location: "New York, USA",
            image: ing4,
            price: "$450",
            rating: 5,
            type: "Event Security",
        },
        {
            name: "Jacob Jones",
            location: "New York, USA",
            image: ing1,
            price: "$500",
            rating: 5,
            type: "Personal Bodyguard",
        },
        {
            name: "Ralph Edwards",
            location: "New York, USA",
            image: ing2,
            price: "$75",
            rating: 4,
            type: "Security Guard",
        },
        {
            name: "Leslie Alexander",
            location: "New York, USA",
            image: ing5,
            price: "$425",
            rating: 5,
            type: "Executive Protections",
        },
        {
            name: "Savannah Nguyen",
            location: "New York, USA",
            image: ing6,
            price: "$450",
            rating: 5,
            type: "Event Security",
        },
        {
            name: "Jacob Jones",
            location: "New York, USA",
            image: ing1,
            price: "$500",
            rating: 5,
            type: "Personal Bodyguard",
        },
        {
            name: "Ralph Edwards",
            location: "New York, USA",
            image: ing2,
            price: "$75",
            rating: 4,
            type: "Security Guard",
        },
        {
            name: "Leslie Alexander",
            location: "New York, USA",
            image: ing5,
            price: "$425",
            rating: 5,
            type: "Executive Protections",
        },
        {
            name: "Savannah Nguyen",
            location: "New York, USA",
            image: ing6,
            price: "$450",
            rating: 5,
            type: "Event Security",
        },
    ]

    // Filter security providers based on selected type
    const filteredProviders = selectedType === "All"
        ? securityProviders
        : securityProviders.filter(provider => provider.type === selectedType);

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

                        <select className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]">
                            <option value="" disabled selected className="text-slate-50">Select Security Type</option>
                            <option>Personal Bodyguard</option>
                            <option>Security Guard</option>
                            <option>Executive Protections</option>
                            <option>Event Security</option>
                        </select>
                    </div>

                </div>
                {/* Search Button */}
                <div className="">
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
                    <SecurityCard key={index} securityProvider={securityProvider} />
                ))}
            </div>
        </div>
    )
}