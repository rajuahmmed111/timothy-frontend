import React from "react";
import { MapPin, Star } from "lucide-react";
export default function HotelHeader({ hotel, reviewAverage }) {
  return (
    <header>
      <div className="container mx-auto py-5 mt-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {hotel?.hotelName || ""}
              </h1>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{`${hotel?.hotelCity || ""}${
                hotel?.hotelCity && hotel?.hotelCountry ? ", " : ""
              }${hotel?.hotelCountry || ""}`}</span>
            </div>
            <div className="flex items-center mt-3 gap-2">
              <span className="text-xl font-normal ">Average Rating : </span>
              {[1, 2, 3, 4, 5].map((s, i) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    i <
                    Math.round(
                      Number((reviewAverage ?? hotel?.averageRating) || 0)
                    )
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-700">
                {Number((reviewAverage ?? hotel?.averageRating) || 0).toFixed(
                  1
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
