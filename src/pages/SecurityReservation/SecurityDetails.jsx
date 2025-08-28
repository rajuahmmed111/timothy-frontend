import React, { useState } from 'react';

import ing1 from "/SecurityProviders/1.png"
import ing2 from "/SecurityProviders/2.png"
import ing4 from "/SecurityProviders/4.png"
import ing5 from "/SecurityProviders/5.png"
import ing6 from "/SecurityProviders/6.png"

import SecurityCard from './SecurityCard';



export default function SecurityDetails() {
    const [selectedType, setSelectedType] = useState("All");
    
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
        <div className='py-16'>
            <div className="bg-white rounded-2xl shadow-lg w-full container mx-auto my-10 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    {/* Location Input */}
                    <div className="space-y-2">
                        {/* <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                        </label> */}
                        <input
                            type="text"
                            placeholder="Find Location"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                        />
                    </div>

                 

                    {/* Security Type Filter */}
                    <div className="space-y-2">
                        <select 
                            className="w-full p-3 border border-gray-200 rounded-lg"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
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
                <div className="">
                    <button className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
                        Search
                    </button>
                </div>
            </div>
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto">
                {filteredProviders.map((securityProvider, index) => (
                    <SecurityCard key={index} securityProvider={securityProvider} />
                ))}
            </div>
        </div>
    )
}