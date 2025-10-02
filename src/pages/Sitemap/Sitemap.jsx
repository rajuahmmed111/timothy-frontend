import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

const MORE_LINKS = [
  'ALTERNATIVE_ACCOMMODATIONS',
  'ALTERNATIVE_ACCOMMODATIONS_HUB',
  'CAR_RENTAL_COMPANY',
  'CAR_RENTAL_DESTINATION',
  'CAR_RENTAL_DESTINATION_SUPPLIER',
  'CAR_RENTAL_GUIDE_CAR_CLASS',
  'CAR_RENTAL_SUPPLIER_LOCATIONS',
  'CRUISE_CRUISELINE',
  'CRUISE_DESTINATION',
  'CRUISE_THEME',
  'DESTINATION_THEME_VACATIONS',
  'FLIGHTS_CARRIER',
  'FLIGHTS_DESTINATION',
  'FLIGHTS_ORIGIN',
  'FLIGHTS_ORIGIN_DESTINATION',
  'HOTEL_DESTINATION',
  'HOTEL_DESTINATION_BRAND',
  'HOTEL_DESTINATION_STAR',
  'HOTEL_INFOSITE',
  'PACKAGE_DESTINATION',
  'THEME_VACATIONS',
  'TRAVEL_GUIDE_ACCOMMODATION',
  'TRAVEL_GUIDE_ACTIVITIES',
  'URL_MAPPING',
  'VACATION_RENTAL',
];

export default function Sitemap() {
  const [showMore, setShowMore] = useState(true);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Global SiteMaps</h1>

        {/* More Links accordion */}
        <div className="mt-6 bg-white rounded-2xl shadow overflow-hidden">
          <button
            onClick={() => setShowMore((s) => !s)}
            className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 text-left"
            aria-expanded={showMore}
          >
            <span className="text-sm md:text-base font-semibold text-gray-900">More Links</span>
            <DownOutlined className={`text-gray-500 transition-transform ${showMore ? 'rotate-180' : ''}`} />
          </button>
          {showMore && (
            <div className="border-t px-4 md:px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-3">
                {MORE_LINKS.map((key) => (
                  <Link
                    key={key}
                    to="#"
                    className="text-[#0064D2] text-xs md:text-sm font-semibold hover:underline"
                  >
                    {key.replaceAll('_', ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs md:text-sm text-gray-500">
          Looking for something else? Visit our <Link to="/" className="text-[#0064D2] font-semibold hover:underline">homepage</Link> or use the site navigation.
        </p>
      </div>
    </div>
  );
}
