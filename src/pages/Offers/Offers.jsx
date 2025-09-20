import React from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../../components/HotelCard/HotelCard';
import ServiceCard from '../../components/ServiceCard/ServiceCard';

// Mock data - replace with actual data from your API
const hotelOffers = [
  {
    id: 1,
    name: 'Luxury Resort',
    location: 'Maldives',
    price: 299,
    rating: 4.8,
    image: '/hotel/1.png',
    discount: '30% OFF',
    originalPrice: 429,
    checkIn: '2023-12-15',
    checkOut: '2023-12-22'
  },
  {
    id: 2,
    name: 'Beachfront Villa',
    location: 'Bali, Indonesia',
    price: 199,
    rating: 4.5,
    image: '/hotel/2.png',
    discount: '25% OFF',
    originalPrice: 265,
    checkIn: '2023-12-10',
    checkOut: '2023-12-20'
  },
  {
    id: 3,
    name: 'Mountain Retreat',
    location: 'Swiss Alps',
    price: 349,
    rating: 4.9,
    image: '/hotel/3.png',
    discount: '20% OFF',
    originalPrice: 436,
    checkIn: '2023-12-05',
    checkOut: '2023-12-15'
  }
];

const serviceOffers = [
  {
    id: 1,
    title: 'Premium Security',
    description: '24/7 professional security service',
    price: 199,
    rating: 4.9,
    image: '/SecurityProviders/1.png',
    discount: '25% OFF',
    originalPrice: 265,
    duration: '1 Month'
  },
  {
    id: 2,
    title: 'Event Security',
    description: 'Professional security personnel',
    price: 349,
    rating: 4.7,
    image: '/SecurityProviders/2.png',
    discount: '20% OFF',
    originalPrice: 436,
    duration: 'Per Event'
  },
  {
    id: 3,
    title: 'Residential Security',
    description: 'Complete home security solutions',
    price: 149,
    rating: 4.8,
    image: '/SecurityProviders/3.png',
    discount: '15% OFF',
    originalPrice: 175,
    duration: '1 Month'
  }
];

const carOffers = [
  {
    id: 1,
    name: 'Luxury Sedan',
    type: 'Sedan',
    price: 89,
    rating: 4.7,
    image: '/car/1.png',
    discount: '20% OFF',
    originalPrice: 111,
    features: ['GPS', 'Bluetooth', 'Air Conditioning']
  },
  {
    id: 2,
    name: 'Premium SUV',
    type: 'SUV',
    price: 129,
    rating: 4.8,
    image: '/car/2.png',
    discount: '15% OFF',
    originalPrice: 152,
    features: ['GPS', 'Sunroof', 'Leather Seats']
  },
  {
    id: 3,
    name: 'Sports Car',
    type: 'Convertible',
    price: 199,
    rating: 4.9,
    image: '/car/3.png',
    discount: '10% OFF',
    originalPrice: 221,
    features: ['Premium Sound', 'Convertible Top', 'Sport Mode']
  }
];

const Offers = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Special Offers
          </h1>
          <p className="mt-3 max-w-3xl mx-auto text-xl text-gray-500 sm:mt-5">
            Exclusive deals and discounts on hotels, security services, and car rentals
          </p>
        </div>

        {/* Hotel Offers Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Hotel Deals</h2>
            {/* <Link to="/hotel-reservation" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Hotel Offers →
            </Link> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotelOffers.map((hotel) => (
              <div key={hotel.id} className="relative">
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                  {hotel.discount}
                </div>
                <HotelCard hotel={hotel} />
                {/* <div className="mt-2 text-sm text-gray-600 line-through">
                  ${hotel.originalPrice}
                </div>
                <div className="text-xs text-gray-500">
                  Valid until: {new Date(hotel.checkOut).toLocaleDateString()}
                </div> */}
              </div>
            ))}
          </div>
        </section>

        {/* Security Service Offers Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Security Service Deals</h2>
            {/* <Link to="/security-reservation" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Security Offers →
            </Link> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serviceOffers.map((service) => (
              <div key={service.id} className="relative">
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                  {service.discount}
                </div>
                <ServiceCard 
                  service={{
                    ...service,
                    icon: null // Add icon if available
                  }} 
                />
                {/* <div className="mt-2 text-sm text-gray-600 line-through">
                  ${service.originalPrice}
                </div>
                <div className="text-xs text-gray-500">
                  Duration: {service.duration}
                </div> */}
              </div>
            ))}
          </div>
        </section>

        {/* Car Rental Offers Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Car Rental Deals</h2>
            {/* <Link to="/car-reservation" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Car Rental Offers →
            </Link> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {carOffers.map((offer) => (
              <div key={offer.id} className="relative">
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                  {offer.discount}
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={offer.image} 
                      alt={offer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold">{offer.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{offer.type}</p>
                    <div className="mt-auto">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold">${offer.price}</span>
                          <span className="text-gray-500 text-sm">/day</span>
                          <div className="text-sm text-gray-600 line-through">
                            ${offer.originalPrice}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{offer.rating}</span>
                        </div>
                      </div>
                      {offer.features && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {offer.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Offers;
