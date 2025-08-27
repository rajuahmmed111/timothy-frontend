import React from 'react';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import { MapPin } from 'lucide-react';
import Dubai from '../../../../public/RecommendedAttractions/1.png';
import London from '../../../../public/RecommendedAttractions/2.png';
import Istanbul from '../../../../public/RecommendedAttractions/3.png';
import NewYork from '../../../../public/RecommendedAttractions/4.png';

export default function RecommendedAttractions() {
    const services = [
        {
            title: "Dubai",
            image: Dubai,
            icon: MapPin,
            description: "564 things to do",
        },
        {
            title: "London",
            image: London,
            icon: MapPin,
            description: "564 things to do",
        },
        {
            title: "Istanbul",
            image: Istanbul,
            icon: MapPin,
            description: "564 things to do",
        },
        {
            title: "New York",
            image: NewYork,
            icon: MapPin,
            description: "564 things to do",
        },
    ]

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mb-12 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Recommended Attractions
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
                        Discover Our Suggested Attractions – Unique Places and Experiences Curated for Your Perfect Journey
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>
            </div>
        </section>
    )
}