import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users } from 'lucide-react';

import ing1 from "../../../public/SecurityProviders/1.png"
import ing2 from "../../../public/SecurityProviders/2.png"
import ing3 from "../../../public/SecurityProviders/3.png"
import ing4 from "../../../public/SecurityProviders/4.png"

import SecurityCard from './SecurityCard';



export default function SecurityDetails() {
    const hotels = [
        {
            name: "Jacob Jones",
            location: "New York, USA",
            image: ing1,
            price: "$500",
            rating: 5,
        },
        {
            name: "Ralph Edwards",
            location: "New York, USA",
            image: ing2,
            price: "$75",
            rating: 4,
        },
        {
            name: "Leslie Alexander",
            location: "New York, USA",
            image: ing3,
            price: "$425",
            rating: 5,
        },
        {
            name: "Savannah Nguyen",
            location: "New York, USA",
            image: ing4,
            price: "$450",
            rating: 5,
        },
        {
            name: "Jacob Jones",
            location: "New York, USA",
            image: ing1,
            price: "$500",
            rating: 5,
        },
        {
            name: "Ralph Edwards",
            location: "New York, USA",
            image: ing2,
            price: "$75",
            rating: 4,
        },
        {
            name: "Leslie Alexander",
            location: "New York, USA",
            image: ing3,
            price: "$425",
            rating: 5,
        },
        {
            name: "Savannah Nguyen",
            location: "New York, USA",
            image: ing4,
            price: "$450",
            rating: 5,
        },
        {
            name: "Jacob Jones",
            location: "New York, USA",
            image: ing1,
            price: "$500",
            rating: 5,
        },
        {
            name: "Ralph Edwards",
            location: "New York, USA",
            image: ing2,
            price: "$75",
            rating: 4,
        },
        {
            name: "Leslie Alexander",
            location: "New York, USA",
            image: ing3,
            price: "$425",
            rating: 5,
        },
        {
            name: "Savannah Nguyen",
            location: "New York, USA",
            image: ing4,
            price: "$450",
            rating: 5,
        },
        {
            name: "Jacob Jones",
            location: "New York, USA",
            image: ing1,
            price: "$500",
            rating: 5,
        },
        {
            name: "Ralph Edwards",
            location: "New York, USA",
            image: ing2,
            price: "$75",
            rating: 4,
        },
        {
            name: "Leslie Alexander",
            location: "New York, USA",
            image: ing3,
            price: "$425",
            rating: 5,
        },
        {
            name: "Savannah Nguyen",
            location: "New York, USA",
            image: ing4,
            price: "$450",
            rating: 5,
        },
    ]
    return (
        <div className='py-16'>
            <div className="bg-white rounded-2xl shadow-lg w-full container mx-auto my-10 p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    {/* Location Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                        </label>
                        <input
                            type="text"
                            placeholder="Enter destination"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                        />
                    </div>

                    {/* Check-in & Check-out */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            Check-in and Check-Out
                        </label>
                        <input
                            type="date"
                            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400"
                        />
                    </div>

                    {/* Guests and Rooms */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Guests and Rooms
                        </label>
                        <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Personal Bodyguard</option>
                            <option>Security Guard</option>
                            <option>Executive Protections</option>
                            <option>Event Security</option>
                        </select>
                    </div>
                </div>
                {/* Search Button */}
                <div className="">
                    <Link to="" className="w-full">
                        <button className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
                            Search
                        </button>
                    </Link>
                </div>
            </div>
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto">
                {hotels.map((hotel, index) => (
                    <SecurityCard key={index} hotel={hotel} />
                ))}
            </div>
        </div>
    )
}