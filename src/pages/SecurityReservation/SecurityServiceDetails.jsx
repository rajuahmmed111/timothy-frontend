import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Star, Shield, Clock, Users, Calendar, CheckCircle } from 'lucide-react';
import BookingForm from '../HotelReservation/BookingForm';

export default function SecurityServiceDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get service data from location state or use default values
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
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Service Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Service Header */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="w-5 h-5 mr-1 text-sky-600" />
                                <span>{service.location}</span>
                                <div className="flex items-center ml-4">
                                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                    <span>{service.rating}.0</span>
                                </div>
                            </div>
                            
                            {/* Service Image */}
                            <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
                                <img 
                                    src={service.image} 
                                    alt={service.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Service Description */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">About This Service</h2>
                                <p className="text-gray-700">{service.description}</p>
                            </div>

                            {/* Service Features */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">Services Provided</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {service.services.map((item, index) => (
                                        <div key={index} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Additional Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <Shield className="w-5 h-5 text-sky-600 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Experience</p>
                                            <p className="font-medium">{service.experience}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-sky-600 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Availability</p>
                                            <p className="font-medium">{service.availability}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-sky-600 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Languages</p>
                                            <p className="font-medium">{service.languages.join(', ')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-sky-600 mr-2" />
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
                    <div className="lg:col-span-1
                    ">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                            {/* Reuse the BookingForm component */}
                            <BookingForm serviceType="security" />
                            
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">
                                        Free cancellation up to 24 hours before service. Full refund if cancelled within the free cancellation period.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
