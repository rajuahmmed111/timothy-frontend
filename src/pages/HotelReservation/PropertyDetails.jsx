import React from 'react';
import { Wifi, Car, Coffee, Waves, Utensils, Dumbbell, Star, User } from 'lucide-react';

export default function PropertyDetails() {
    const amenities = [
        { icon: Wifi, label: 'Free WiFi' },
        { icon: Car, label: 'Free Parking' },
        { icon: Coffee, label: 'Coffee Bar' },
        { icon: Waves, label: 'Swimming Pool' },
        { icon: Utensils, label: 'Restaurant' },
        { icon: Dumbbell, label: 'Fitness Center' }
    ];
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Azure Oasis</h2>
                <p className="text-gray-700 leading-relaxed">
                    Nestled along the pristine shores of Thailand's Riviera, Azure Oasis offers an unparalleled luxury experience.
                    Our Mediterranean-inspired architecture blends seamlessly with tropical surroundings, creating an oasis of
                    tranquility and sophistication. Each room is thoughtfully designed with modern amenities and stunning ocean views.
                </p>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity, index) => {
                        const Icon = amenity.icon;
                        return (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <Icon className="w-5 h-5 text-sky-600" />
                                <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}


