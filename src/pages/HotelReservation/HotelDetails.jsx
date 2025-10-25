import React from 'react';

import HotelHeader from './HotelHeader';
import ImageGallery from './ImageGallery';
import PropertyDetails from './PropertyDetails';
import BookingForm from './BookingForm';
import { useGetHotelDetailsQuery } from '../../redux/api/hotel/hotelApi';
import { useParams } from 'react-router-dom';

export default function HotelDetails() {
    const { id } = useParams();
    const { data: hotelDetails } = useGetHotelDetailsQuery(id);
    console.log(hotelDetails);
    return (
        <div className="min-h-screen bg-gray-50">
            <HotelHeader hotel={hotelDetails?.data} />
            <main className="container mx-auto px-5 md:px-0 ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ImageGallery hotel={hotelDetails?.data} />
                        <PropertyDetails hotel={hotelDetails?.data} />
                    </div>

                    <div className="lg:col-span-1">
                        <BookingForm hotel={hotelDetails?.data} />
                    </div>
                </div>
            </main>
        </div>
    );
}