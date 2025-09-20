import React from 'react';
import { Car, Shield, MapPin, House } from 'lucide-react';




import ServiceCard from '../../components/ServiceCard/ServiceCard';

export default function AvailableService() {
    const services = [
        {
            title: "Personal Bodyguard",
            image: "/security/1.png",
            // icon: House,
            description: "24 available",
        },
        {
            title: "Security Guard",
            image: "/security/2.png",
            // icon: Car,
            description: "12 available",
        },
        {
            title: "Executive Protection",
            image: "/security/3.png",
            // icon: Shield,
            description: "20 available",
        },
        {
            title: "Event Security",
            image: "/security/4.png",
            // icon: MapPin,
            description: "25 available",
        },
    ]

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-5 md:px-0">
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