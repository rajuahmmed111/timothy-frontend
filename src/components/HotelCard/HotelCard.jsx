import React from 'react';
import { Star, MapPin } from "lucide-react";
import { Link } from 'react-router-dom';

export default function HotelCard({ hotel }) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Hotel Image */}
            <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                        Popular
                    </div>
                </div>
            </div>

            {/* Hotel Details */}
            <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {hotel.name}
                </h3>
                {/* Hotel Location */}
                <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" /> {hotel.location}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl font-bold text-gray-900">
                        {hotel.price}
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(hotel.rating)].map((_, i) => (
                            <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                            ({hotel.rating}.0)
                        </span>
                    </div>
                </div>

                {/* Price & Button */}
                <div className="w-full">
                    <Link to="/hotel-details" className="w-full">
                        <button className="w-full bg-[#0064D2] text-white px-4 py-2 rounded-lg text-sm font-bold">
                            Book Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
