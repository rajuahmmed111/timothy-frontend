import React from "react";
import {
  Wifi,
  Car,
  Coffee,
  Waves,
  Utensils,
  Dumbbell,
  Star,
  User,
} from "lucide-react";

export default function PropertyDetails({ hotel }) {
  const amenityDefs = [
    { key: 'hoitelWifi', icon: Wifi, label: 'Free WiFi' },
    { key: 'hotelParking', icon: Car, label: 'Free Parking' },
    { key: 'hotelCoffeeBar', icon: Coffee, label: 'Coffee Bar' },
    { key: 'hotelPool', icon: Waves, label: 'Swimming Pool' },
    { key: 'hotelRestaurant', icon: Utensils, label: 'Restaurant' },
    { key: 'hotelGym', icon: Dumbbell, label: 'Fitness Center' },
    { key: 'hotelSpa', icon: Dumbbell, label: 'Spa' },
  ];
  const amenities = amenityDefs.filter(a => hotel?.[a.key]);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "March 2024",
      comment:
        "Absolutely stunning property! The ocean views were breathtaking and the staff went above and beyond to make our stay memorable. The facilities were top-notch and the room was immaculate.",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      date: "February 2024",
      comment:
        "Great location and beautiful architecture. The swimming pool area was fantastic and the restaurant served excellent food. Only minor issue was the WiFi speed in some areas.",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      rating: 5,
      date: "January 2024",
      comment:
        "Perfect honeymoon destination! The Mediterranean-inspired design is beautiful and the sunset views from our balcony were unforgettable. Highly recommend the spa services.",
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About {hotel?.hotelName || 'Hotel'}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {hotel?.businessDescription || 'No description available.'}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Facilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon className="w-5 h-5 text-sky-600" />
                <span className="text-sm font-medium text-gray-700">
                  {amenity.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* add canclation policy */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Cancellation Policy
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {hotel?.hotelCancelationPolicy || 'Please refer to the property for cancellation policy.'}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-900 whitespace-nowrap">Guest Reviews</h3>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
            overall rating (Good)
          </span>
        </div>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
