import React, { useState } from "react";

export default function ImageGallery({ images = [], data = [], alt = '' }) {
  console.log(images, data)
  // Normalize inputs: accept either array of URLs via `images`,
  // or array of guards via `data` (each may contain securityImages[])
  const guardImages = Array.isArray(data)
    ? data.flatMap((g) => (Array.isArray(g?.securityImages) ? g.securityImages : []))
    : [];
  const urlImages = Array.isArray(images) ? images : [];
  const allImages = [...new Set([...urlImages, ...guardImages].filter(Boolean))];

  const [primaryImage, setPrimaryImage] = useState(allImages[0] || '');

  // Keep primary image in sync when image sources change
  React.useEffect(() => {
    if (!primaryImage || !allImages.includes(primaryImage)) {
      setPrimaryImage(allImages[0] || '');
    }
  }, [allImages.join('|')]);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Left side - Main large image */}
      <div className="w-full md:w-2/3">
        <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden">
          <img
            src={primaryImage}
            alt={alt}
            className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          />
        </div>
      </div>

      {/* Thumbnails: horizontal scroll on mobile, vertical scroll on desktop */}
      <div className="w-full md:w-1/3">
        <div
          className="flex md:flex-col gap-3 md:h-full md:max-h-[500px] md:overflow-y-auto overflow-x-auto pr-2"
          style={{ scrollbarWidth: 'thin' }}
        >
          {allImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                primaryImage === src ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setPrimaryImage(src)}
            >
              <img
                src={src}
                alt={`${alt} ${index + 1}`}
                className="md:w-full md:h-32 w-32 h-24 object-cover rounded-md hover:opacity-90 transition-opacity"
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
