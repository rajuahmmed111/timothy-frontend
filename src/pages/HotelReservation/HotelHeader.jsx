import React, { useState } from 'react';
import { MapPin, Star, ExternalLink } from 'lucide-react';
export default function HotelHeader() {
    const [hoveredMarker, setHoveredMarker] = useState(null);

    const openFullMap = () => {
        // Open Google Maps with hotel location
        const lat = 7.8731;
        const lng = 98.3952;
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=Azure+Oasis+Hotel`;
        window.open(url, '_blank');
    };

    const hotels = [
        { id: 1, name: 'Beachfront Resort', position: { top: 12, left: 16 }, rating: 4, price: 180 },
        { id: 2, name: 'City Center Hotel', position: { top: 20, left: 24 }, rating: 3, price: 120 },
        { id: 3, name: 'Mountain Lodge', position: { top: 28, left: 32 }, rating: 5, price: 250 },
        { id: 4, name: 'Spa Resort', position: { top: 16, left: 40 }, rating: 4, price: 200 },
        { id: 5, name: 'Budget Inn', position: { top: 24, left: 48 }, rating: 3, price: 80 },
        { id: 6, name: 'Azure Oasis', position: { top: 20, left: 36 }, rating: 5, price: 300, isMain: true }
    ];

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

                    {/* Interactive Map Component */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-80 h-48">
                        {/* Real Map Container */}
                        <div className="relative h-40">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.234567890123!2d98.3952!3d7.8731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNTInMjMuMiJOIDk4wrAyMycwNi43IkU!5e0!3m2!1sen!2sth!4v1234567890123!5m2!1sen!2sth"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Hotel Location Map"
                            ></iframe>
                            
                            {/* Map Overlay with Hotel Info */}
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2 max-w-xs">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <div>
                                        <h5 className="font-semibold text-xs text-gray-900">Azure Oasis Hotel</h5>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                    key={star} 
                                                    className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Controls */}
                            <div className="absolute bottom-2 right-2 flex flex-col gap-1">
                                <button 
                                    onClick={() => {
                                        const iframe = document.querySelector('iframe');
                                        if (iframe) {
                                            iframe.src = iframe.src; // Refresh map
                                        }
                                    }}
                                    className="bg-white/90 backdrop-blur-sm rounded p-1.5 shadow-sm hover:bg-white transition-colors"
                                    title="Refresh Map"
                                >
                                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* View in full map link */}
                        <div className="bg-white border-t border-gray-100">
                            <button 
                                onClick={openFullMap}
                                className="flex items-center justify-center w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View in full map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}