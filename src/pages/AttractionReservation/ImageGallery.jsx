import React, { useState } from "react";

export default function ImageGallery({ images, data }) {
  // Prefer explicit images prop; fall back to data.attractionImages when provided
  const sourceImages =
    images !== undefined
      ? images
      : Array.isArray(data?.attractionImages)
      ? data.attractionImages
      : [];

  // Normalize inputs: accept either array of URLs via `images` / `data.attractionImages`,
  // or array of guards (each may contain securityImages[])
  const isArray = Array.isArray(sourceImages);
  const hasGuardImages =
    isArray && sourceImages.some((g) => Array.isArray(g?.securityImages));

  // If we have guards with securityImages, take those; otherwise treat as URL array
  const allImages = hasGuardImages
    ? [
        ...new Set(
          sourceImages
            .flatMap((g) =>
              Array.isArray(g?.securityImages) ? g.securityImages : []
            )
            .filter(Boolean)
        ),
      ]
    : isArray
    ? sourceImages.filter(Boolean)
    : [];

  const [primaryImage, setPrimaryImage] = useState(allImages[0] || "");

  // Keep primary image in sync when image sources change
  React.useEffect(() => {
    if (!allImages.length) {
      if (primaryImage !== "") {
        setPrimaryImage("");
      }
      return;
    }

    if (!primaryImage || !allImages.includes(primaryImage)) {
      setPrimaryImage(allImages[0] || "");
    }
  }, [allImages, primaryImage]);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const baseAlt =
    Array.isArray(sourceImages) && sourceImages[0] && sourceImages[0].name
      ? sourceImages[0].name
      : "Image";

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Left side - Main large image */}
      <div className="w-full md:w-2/3">
        <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden">
          <img
            src={primaryImage}
            alt={baseAlt}
            className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          />
        </div>
      </div>

      {/* Thumbnails: horizontal scroll on mobile, vertical scroll on desktop */}
      <div className="w-full md:w-1/3">
        <div
          className="flex md:flex-col gap-3 md:h-full md:max-h-[500px] md:overflow-y-auto overflow-x-auto pr-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {allImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                primaryImage === src
                  ? "border-blue-500"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setPrimaryImage(src)}
            >
              <img
                src={src}
                alt={`${baseAlt} ${index + 1}`}
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
