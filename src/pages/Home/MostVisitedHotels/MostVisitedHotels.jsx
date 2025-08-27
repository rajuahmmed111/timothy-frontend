import React from 'react';
import HotelCard from '../../../components/HotelCard/HotelCard';
import ing1 from "../../../../public/hotel/1.png"
import ing2 from "../../../../public/hotel/2.png"
import ing3 from "../../../../public/hotel/3.png"
import ing4 from "../../../../public/hotel/4.png"

export default function MostVisitedHotels() {
    const hotels = [
        {
            name: "Luxury Hotel",
            location: "New York, USA",
            image: ing1,
            price: "$500",
            rating: 5,
        },
        {
            name: "Comfort Hotel",
            location: "New York, USA",
            image: ing2,
            price: "$75",
            rating: 4,
        },
        {
            name: "Majestic Serenity Palace",
            location: "New York, USA",
            image: ing3,
            price: "$425",
            rating: 5,
        },
        {
            name: "Grand Hotel",
            location: "New York, USA",
            image: ing4,
            price: "$450",
            rating: 5,
        },
    ]

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mb-12 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Most Visited Hotels This Month
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
                        These top-rated hotels have captured the attention of travelers
                        around the world with their exceptional service, stunning design, and
                        unforgettable experiences.
                    </p>
                </div>

                {/* Hotels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {hotels.map((hotel, index) => (
                        <HotelCard key={index} hotel={hotel} />
                    ))}
                </div>
            </div>
        </section>
    )
}
