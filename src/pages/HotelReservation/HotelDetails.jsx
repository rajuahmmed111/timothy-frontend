import React from 'react';

import HotelHeader from './HotelHeader';
import ImageGallery from './ImageGallery';
import PropertyDetails from './PropertyDetails';
import BookingForm from './BookingForm';
import { useLocation } from 'react-router-dom';

export default function HotelDetails() {
    const location = useLocation();
    const hotel = location.state?.hotel;

    if (!hotel) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-gray-600">No hotel selected. Please go back to the listings and choose a hotel.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <HotelHeader hotel={hotel} />
            <main className="container mx-auto px-5 md:px-0 ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ImageGallery hotel={hotel} />
                        <PropertyDetails hotel={hotel} />
                    </div>

                    <div className="lg:col-span-1">
                        <BookingForm hotel={hotel} />
                    </div>
                </div>
            </main>
        </div>
    );
}