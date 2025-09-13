import React from 'react';
import { MapPin, Star } from 'lucide-react';
export default function HotelHeader() {
    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-5 lg:px-0 py-16">
                <div className="flex items-center justify-start">
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
                </div>
            </div>
        </header>
    );
}