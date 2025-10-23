import React from 'react';
import ServiceCardForRecommendedAttractions from './ServiceCard';
import { MapPin } from 'lucide-react'
import { useGetAttractionBusinessQuery } from '../../../redux/api/attraction/attractionApi';

export default function RecommendedAttractions() {
    const { data, isLoading, error } = useGetAttractionBusinessQuery(4);

    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error loading attractions</div>;

    // Transform API data to match ServiceCard props
    const attractions = data?.data?.data?.map(attraction => {
        // Get the first appeal for each attraction
        const appeal = attraction.appeal?.[0];
        return {
            id: attraction.id,
            title: appeal?.attractionCity || 'Unknown City',
            image: appeal?.attractionImages?.[0] || '/placeholder-image.jpg',
            icon: MapPin,
            description: appeal?.attractionCountry || 'Explore now',
            rating: parseFloat(appeal?.attractionRating) || 0,
            price: appeal?.attractionAdultPrice || 0,
            discount: appeal?.discount || 0
        };
    }) || [];

    return (
        <section className="py-10 bg-gray-50">
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
                    {attractions.map((attraction) => (
                        <ServiceCardForRecommendedAttractions key={attraction.id} service={attraction} />
                    ))}
                </div>
            </div>
        </section>
    )
}