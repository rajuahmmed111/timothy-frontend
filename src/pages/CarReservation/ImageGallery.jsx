import React, { useState } from "react";
export default function ImageGallery({ car }) {
  const fallback = "/car/default-car.png";
  const images = Array.isArray(car?.images)
    ? car.images
    : Array.isArray(car?.carImages)
    ? car.carImages
    : [];

  const [primaryImage, setPrimaryImage] = useState(images[0] || fallback);

  const allImages = [primaryImage, ...images].filter(Boolean);
  const secondaryImages = allImages.filter((src) => src !== primaryImage);

  return (
    <div className="flex gap-4 mb-8">
      {/* Left side - Main large image */}
      <div className="w-2/3">
        <div className="relative w-full h-[600px]">
          <img
            src={primaryImage}
            alt={primaryImage || "Car Image"}
            className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          />
        </div>
      </div>

      {/* Right side - List of all images (including primary) */}
      <div className="flex flex-col w-1/3 gap-2 max-h-[600px] overflow-y-auto">
        {allImages.map((src, index) => (
          <div
            key={index}
            className="relative  cursor-pointer"
            onClick={() => {
              setPrimaryImage(src);
            }}
          >
            <img
              src={src}
              alt={`Gallery ${index + 1}`}
              className="w-full h-[150px] object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group-hover:brightness-75"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
