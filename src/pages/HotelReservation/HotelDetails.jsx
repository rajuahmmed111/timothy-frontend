import React from 'react';

import HotelHeader from './HotelHeader';
import ImageGallery from './ImageGallery';
import PropertyDetails from './PropertyDetails';
import BookingForm from './BookingForm';

export default function HotelDetails() {
    return (
        <div className="min-h-screen bg-gray-50">
            <HotelHeader />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ImageGallery />
                        <PropertyDetails />
                    </div>

                    <div className="lg:col-span-1">
                        <BookingForm />
                    </div>
                </div>
            </main>
        </div>
    );
}