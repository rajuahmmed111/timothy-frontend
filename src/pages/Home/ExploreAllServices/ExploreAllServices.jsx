import React from 'react';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import { Car, Shield, MapPin, House } from 'lucide-react';
import hotelBookingService from '../../../../public/ExploreAllServices/1.png';
import carRentalService from '../../../../public/ExploreAllServices/2.png';
import securityService from '../../../../public/ExploreAllServices/3.png';
import touristAttractions from '../../../../public/ExploreAllServices/4.png';

export default function ExploreAllServices() {
    const services = [
        {
            title: "Hotel Reservation",
            image: hotelBookingService,
            icon: House,
            description: "24 available",
        },
        {
            title: "Car Rental",
            image: carRentalService,
            icon: Car,
            description: "12 available",
        },
        {
            title: "Security Protocol",
            image: securityService,
            icon: Shield,
            description: "20 available",
        },
        {
            title: "Attractions",
            image: touristAttractions,
            icon: MapPin,
            description: "25 available",
        },
    ]

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mb-12 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Explore Our All Services
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
                        From comfortable accommodations and reliable car rentals, to
                        security protocols and local attractions — everything you need for a
                        perfect trip.
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

