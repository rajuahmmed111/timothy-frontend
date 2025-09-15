import React, { useState } from 'react';
import { MapPin, Star, ExternalLink } from 'lucide-react';
export default function HotelHeader() {
    const [showFullMap, setShowFullMap] = useState(false);

    const openFullMap = () => {
        // Open Google Maps with hotel location
        const lat = 7.8731;
        const lng = 98.3952;
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=Azure+Oasis+Hotel`;
        window.open(url, '_blank');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-5 lg:px-0 py-16">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">Azure Oasis</h1>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">Riviera Resort, Pristine Thailand</span>
                        </div>
                    </div>

                    {/* Mini Map Component */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-80 h-48">
                        {/* Map Container */}
                        <div className="relative h-40 bg-gradient-to-br from-blue-100 via-green-50 to-green-100">
                            {/* Coastline representation */}
                            <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-blue-200 to-blue-100 opacity-60"></div>
                            
                            {/* Road/Path */}
                            <div className="absolute top-8 left-12 w-32 h-1 bg-gray-300 transform rotate-12"></div>
                            <div className="absolute top-16 left-20 w-24 h-1 bg-gray-300 transform -rotate-6"></div>
                            
                            {/* Hotel Markers */}
                            <div className="absolute top-12 left-16 w-3 h-3 bg-blue-600 rounded-sm transform rotate-45 shadow-sm"></div>
                            <div className="absolute top-20 left-24 w-3 h-3 bg-blue-600 rounded-sm transform rotate-45 shadow-sm"></div>
                            <div className="absolute top-28 left-32 w-3 h-3 bg-blue-600 rounded-sm transform rotate-45 shadow-sm"></div>
                            <div className="absolute top-16 left-40 w-3 h-3 bg-blue-600 rounded-sm transform rotate-45 shadow-sm"></div>
                            <div className="absolute top-24 left-48 w-3 h-3 bg-blue-600 rounded-sm transform rotate-45 shadow-sm"></div>
                            
                            {/* Main Hotel Marker (Azure Oasis) */}
                            <div className="absolute top-20 left-36 w-4 h-4 bg-orange-500 rounded-sm transform rotate-45 shadow-md border-2 border-white"></div>
                            
                            {/* Green areas (parks/nature) */}
                            <div className="absolute bottom-4 right-8 w-20 h-12 bg-green-200 rounded-full opacity-70"></div>
                            <div className="absolute top-4 right-12 w-16 h-8 bg-green-200 rounded-full opacity-70"></div>
                        </div>
                        
                        {/* View in map link */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            <button 
                                onClick={openFullMap}
                                className="flex items-center justify-center w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View in a map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}