import React from 'react';
import { MapPin, Star, Car, Clock, Users, CheckCircle, Fuel, Settings } from 'lucide-react';
import CarBookingForm from './CarBookingForm';
import img1 from "/car/1.png"


export default function CarServiceDetails() {
    const car = {
        id: 1,
        name: "Toyota Camry",
        location: "New York, USA",
        image: img1,
        price: "$500",
        rating: 5,
        availability: "Available",
        mileage: "15,000 km",
        transmission: "Automatic",
        fuelType: "Petrol",
        seats: 5,
        year: 2022,
        description:
            "The Toyota Camry 2022 offers a perfect balance of comfort, performance, and reliability. With its powerful yet fuel-efficient petrol engine, smooth automatic transmission, and spacious 5-seater design, it's an ideal choice for family trips and city drives. Equipped with modern features and a stylish exterior, the Camry delivers a premium driving experience.",
    };



    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="md:flex">
                            {/* Left Column - Car Details */}
                            <div className="p-6 md:p-8 md:w-2/3">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{car?.name}</h1>
                                <div className="flex items-center text-gray-600 mb-6">
                                    <MapPin className="w-5 h-5 mr-1 text-sky-600" />
                                    <span>{car?.location}</span>
                                    <div className="flex items-center ml-4">
                                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                        <span>{car?.rating}.0</span>
                                    </div>
                                </div>

                                {/* Car Image */}
                                <div className="mb-8 rounded-lg overflow-hidden">
                                    <img
                                        src={car.image}
                                        alt={car.name}
                                        className="w-full h-96 object-cover rounded-lg"
                                    />
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-3">About This Car</h2>
                                    <p className="text-gray-700 mb-6">{car?.description}</p>


                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold">Car Specifications</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <Car className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Year</p>
                                                    <p className="font-medium">{car?.year || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Capacity</p>
                                                    <p className="font-medium">{car?.seats}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Fuel className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Fuel Type</p>
                                                    <p className="font-medium">{car?.fuelType || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Settings className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Transmission</p>
                                                    <p className="font-medium">{car.transmission || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Fuel className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Mileage</p>
                                                    <p className="font-medium">{car.mileage || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Availability</p>
                                                    <p className="font-medium">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${car.availability === 'Available'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {car.availability || 'N/A'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Booking Form */}
                            <div className="p-6 md:p-8 md:w-1/3 bg-gray-50 border-l border-gray-200">
                                <CarBookingForm car={car} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
