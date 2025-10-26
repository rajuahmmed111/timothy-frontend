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

  const avgRating = Number(hotel?.averageRating || 0);
  const reviewCount = Number(hotel?.averageReviewCount || 0);

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

      { (avgRating > 0 || reviewCount > 0) && (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 whitespace-nowrap">Guest Reviews</h3>
            {avgRating > 0 && (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                Rating {avgRating.toFixed(1)}{reviewCount > 0 ? ` · ${reviewCount} reviews` : ''}
              </span>
            )}
          </div>
          {avgRating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              {renderStars(Math.round(avgRating))}
              <span className="text-sm text-gray-600 ml-1">
                ({avgRating.toFixed(1)})
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
