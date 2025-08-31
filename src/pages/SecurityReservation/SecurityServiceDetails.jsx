import React from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Star, Shield, Clock, Users, CheckCircle } from 'lucide-react';
import SecurityBookingForm from './SecurityBookingForm';

export default function SecurityServiceDetails() {
    const location = useLocation();

    const service = location.state?.service || {
        id: 1,
        name: "Jacob Jones",
        location: "New York, USA",
        image: "/SecurityProviders/1.png",
        price: 500,
        rating: 5,
        description: "Professional security service with 10+ years of experience in personal and corporate security.",
        services: [
            "24/7 Security Personnel",
            "Armed & Unarmed Guards",
            "Event Security",
            "CCTV Monitoring",
            "Rapid Response"
        ],
        experience: "10+ years",
        languages: ["English", "Spanish"],
        availability: "24/7",
        certification: "Licensed & Certified"
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="md:flex">
                            {/* Left Column - Service Details */}
                            <div className="p-6 md:p-8 md:w-2/3">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                                <div className="flex items-center text-gray-600 mb-6">
                                    <MapPin className="w-5 h-5 mr-1 text-sky-600" />
                                    <span>{service.location}</span>
                                    <div className="flex items-center ml-4">
                                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                        <span>{service.rating}.0</span>
                                    </div>
                                </div>

                                {/* Service Image */}
                                <div className="mb-8 rounded-lg overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="w-full h-96 object-cover rounded-lg"
                                    />
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-3">About This Service</h2>
                                    <p className="text-gray-700 mb-6">{service.description}</p>

                                    <h2 className="text-xl font-semibold mb-3">Services Provided</h2>
                                    <div className="grid grid-cols-1 gap-2 mb-6">
                                        {service.services.map((item, index) => (
                                            <div key={index} className="flex items-start">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold">Additional Information</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <Shield className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Experience</p>
                                                    <p className="font-medium">{service.experience}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Availability</p>
                                                    <p className="font-medium">{service.availability}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Languages</p>
                                                    <p className="font-medium">{service.languages.join(', ')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Certification</p>
                                                    <p className="font-medium">{service.certification}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Booking Form */}
                            <div className="p-6 md:p-8 md:w-1/3 bg-gray-50 border-l border-gray-200">
                                <SecurityBookingForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
