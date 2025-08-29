import React, { useState } from 'react';

import ing1 from "/car/1.png"
import ing2 from "/car/2.png"
import ing3 from "/car/4.png"
import ing4 from "/car/3.png"
// import ing6 from "/car/6.png"


import CarCard from './CarCard';



export default function CarDetails() {
    const [selectedType, setSelectedType] = useState("All");

    const CarProviders = [
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
            image: ing3,
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
            image: ing3,
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
            image: ing3,
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
            image: ing3,
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
    ]



    return (
        <div className='py-16'>
            <div className="bg-white rounded-2xl shadow-lg w-full container mx-auto my-10 p-5">
                <div className="mb-5">
                    {/* Location Input */}
                    <div className="space-y-2">

                        <input
                            type="text"
                            placeholder="Find Location"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                        />
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
                {CarProviders.map((car, index) => (
                    <CarCard key={index} car={car} />
                ))}
            </div>
        </div>
    )
}