import React from "react";
import { Link } from "react-router-dom";
import { useGetAllHotelRoomsQuery } from "../../redux/api/hotel/hotelApi";
import { useGetSecurityProtocolsRootQuery } from "../../redux/api/security/getAllSecurityApi";
import { useGetAllCarsQuery } from "../../redux/api/car/getAllCarsApi";
import HotelCard from "../../components/HotelCard/HotelCard";
import ServiceCard from "../../components/ServiceCard/ServiceCard";

const Offers = () => {
  const {
    data: hotelData,
    isLoading: hotelLoading,
    error: hotelError,
  } = useGetAllHotelRoomsQuery();

  const {
    data: securityData,
    isLoading: securityLoading,
    error: securityError,
  } = useGetSecurityProtocolsRootQuery();

  const {
    data: carData,
    isLoading: carLoading,
    error: carError,
  } = useGetAllCarsQuery();

  // Extract all rooms from all hotels and filter those with discounts
  const hotelOffers = React.useMemo(() => {
    if (!hotelData?.data?.data) return [];

    const allRooms = [];

    hotelData.data.data.forEach((hotel) => {
      if (hotel.room && Array.isArray(hotel.room)) {
        hotel.room.forEach((room) => {
          // Only include rooms with discount > 0
          if (room.discount && room.discount > 0) {
            // Calculate discounted price from convertedPrice and discount percentage
            const discountedPrice =
              room.convertedPrice - (room.convertedPrice * room.discount) / 100;

            allRooms.push({
              ...room,
              hotelName: hotel.hotelName,
              hotelBusinessName: hotel.hotelBusinessName,
              hotelAddress: hotel.hotelAddress,
              hotelCity: hotel.hotelCity,
              hotelCountry: hotel.hotelCountry,
              hotelRating: hotel.averageRating,
              hotelReviewCount: hotel.averageReviewCount,
              displayCurrency: room.displayCurrency || hotel.displayCurrency,
              currencySymbol: hotel.currencySymbol,
              discountedPrice: discountedPrice,
              originalPrice: room.convertedPrice, // Use convertedPrice as original for display
              // Calculate discount percentage
              discountPercentage: room.discount,
              location: `${hotel.hotelAddress}, ${hotel.hotelCity}`,
            });
          }
        });
      }
    });

    return allRooms;
  }, [hotelData]);

  console.log("hotelOffer", hotelOffers);

  // Extract all security guards from all security businesses and filter those with discounts
  const securityOffers = React.useMemo(() => {
    if (!securityData?.data?.data) return [];

    const allGuards = [];

    securityData.data.data.forEach((business) => {
      if (business.security_Guard && Array.isArray(business.security_Guard)) {
        business.security_Guard.forEach((guard) => {
          // Only include guards with discount > 0
          if (guard.discount && guard.discount > 0) {
            // Calculate discounted price from convertedPrice and discount percentage
            const discountedPrice =
              guard.convertedPrice -
              (guard.convertedPrice * guard.discount) / 100;

            allGuards.push({
              ...guard,
              securityBusinessName: business.securityBusinessName,
              securityName: business.securityName,
              businessLogo: business.businessLogo,
              securityProtocolDescription: business.securityProtocolDescription,
              securityProtocolType: business.securityProtocolType,
              averageRating: business.averageRating,
              averageReviewCount: business.averageReviewCount,
              displayCurrency:
                guard.displayCurrency || business.displayCurrency,
              currencySymbol: business.currencySymbol,
              discountedPrice: discountedPrice,
              // Calculate discount percentage
              discountPercentage: guard.discount,
            });
          }
        });
      }
    });

    return allGuards;
  }, [securityData]);

  // Extract all cars and filter those with discounts
  const carOffers = React.useMemo(() => {
    if (!carData?.data?.data) return [];

    return carData.data.data
      .filter((car) => car.discount && car.discount > 0)
      .map((car) => {
        // Calculate discounted price from convertedPrice and discount percentage
        const discountedPrice =
          car.convertedPrice - (car.convertedPrice * car.discount) / 100;

        return {
          ...car,
          discountedPrice: discountedPrice,
          // Calculate discount percentage
          discountPercentage: car.discount,
        };
      });
  }, [carData]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Special Offers
          </h1>
          <p className="mt-3 max-w-3xl mx-auto text-xl text-gray-500 sm:mt-5">
            Exclusive deals and discounts on hotels, security services, and car
            rentals
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

          {hotelLoading ? (
            <div className="text-center py-8">Loading hotel deals...</div>
          ) : hotelError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load hotel deals
            </div>
          ) : hotelOffers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hotel deals available at the moment
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotelOffers.map((room) => (
                <div key={room.id} className="relative">
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    {room.discountPercentage}% OFF
                  </div>
                  <HotelCard
                    hotel={{
                      id: room.id,
                      name: room.hotelName,
                      location: `${room.hotelAddress}, ${room.hotelCity}`,
                      price: room.discountedPrice,
                      originalPrice: room.originalPrice,
                      rating: room.hotelRating,
                      image: room.hotelImages?.[0] || room.hotelImages?.[0],
                      roomType: room.hotelRoomType,
                      displayCurrency: room.displayCurrency,
                      currencySymbol: room.currencySymbol,
                      reviewCount: room.hotelReviewCount,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Security Service Offers Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Security Service Deals
            </h2>
            {/* <Link to="/security-reservation" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Security Offers →
            </Link> */}
          </div>

          {securityLoading ? (
            <div className="text-center py-8">Loading security deals...</div>
          ) : securityError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load security deals
            </div>
          ) : securityOffers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No security deals available at the moment
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {securityOffers.map((guard) => (
                <div key={guard.id} className="relative">
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    {guard.discountPercentage}% OFF
                  </div>
                  <ServiceCard
                    service={{
                      id: guard.id,
                      title: guard.securityGuardName,
                      description: guard.securityGuardDescription,
                      price: guard.discountedPrice,
                      originalPrice: guard.originalPrice,
                      rating: guard.securityRating,
                      image: guard.securityImages?.[0],
                      category: guard.category,
                      displayCurrency: guard.displayCurrency,
                      currencySymbol: guard.currencySymbol,
                      reviewCount: guard.securityReviewCount,
                      experience: guard.experience,
                      availability: guard.availability,
                      services: guard.securityServicesOffered,
                      businessName: guard.securityBusinessName,
                      icon: null,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Car Rental Offers Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Car Rental Deals
            </h2>
            {/* <Link to="/car-reservation" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Car Rental Offers →
            </Link> */}
          </div>

          {carLoading ? (
            <div className="text-center py-8">Loading car deals...</div>
          ) : carError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load car deals
            </div>
          ) : carOffers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No car deals available at the moment
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {carOffers.map((car) => (
                <div key={car.id} className="relative">
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    {car.discountPercentage}% OFF
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={car.carImages?.[0]}
                        alt={car.carModel}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold">{car.carModel}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {car.carType}
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xl font-bold">
                              {car.displayCurrency}
                              {car.discountedPrice}
                            </span>
                            <span className="text-gray-500 text-sm">/day</span>
                            <div className="text-sm text-gray-600 line-through">
                              {car.displayCurrency}
                              {car.originalPrice}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{car.carRating}</span>
                          </div>
                        </div>
                        {car.carServicesOffered && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {car.carServicesOffered
                              .slice(0, 3)
                              .map((feature, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                                >
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
          )}
        </section>
      </div>
    </div>
  );
};

export default Offers;
