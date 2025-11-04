import React, { useState } from "react";

export default function ImageGallery({ images, alt = '' }) {
  const [primaryImage, setPrimaryImage] = useState(images[0] || '');
  
  // Filter out any null/undefined images and ensure unique URLs
  const allImages = [...new Set(images.filter(Boolean))];

  if (allImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4 mb-8">
      {/* Left side - Main large image */}
      <div className="w-2/3">
        <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
          <img
            src={primaryImage}
            alt={alt}
            className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          />
        </div>
      </div>

      {/* Right side - Vertical scrollable thumbnails */}
      <div className="w-1/3">
        <div className="flex flex-col gap-3 h-full max-h-[500px] overflow-y-auto pr-2">
          {allImages.map((src, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                primaryImage === src ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setPrimaryImage(src)}
            >
              <img
                src={src}
                alt={`${alt} ${index + 1}`}
                className="w-full h-32 object-cover rounded-md hover:opacity-90 transition-opacity"
              />
              {primaryImage === src && (
                <div className="absolute inset-0 bg-black/20 rounded-md" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
