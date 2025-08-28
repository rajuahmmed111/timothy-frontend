import React from 'react';
import ing1 from "../../../public/SecurityProviders/1.png"
import ing2 from "../../../public/SecurityProviders/2.png"
import ing3 from "../../../public/SecurityProviders/3.png"
import ing4 from "../../../public/SecurityProviders/4.png"
import HotelCard from '../../components/HotelCard/HotelCard';
import SecurityCard from './SecurityCard';

export default function SecurityProviders() {
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
    ]

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-5 md:px-0">
                {/* Section Header */}
                <div className="mb-12 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Security Providers
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
                        Discover trusted and professional security providers carefully verified for your safety.
                        From personal bodyguards to event security teams and home patrol services, our featured
                        partners are rated by customers for reliability,
                        experience, and quality service. Book confidently knowing you are in safe hands.
                    </p>
                </div>

                {/* Hotels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {hotels.map((hotel, index) => (
                        <SecurityCard key={index} hotel={hotel} />
                    ))}
                </div>
            </div>
        </section>
    )
}
