import React, { useState } from "react";
export default function ImageGallery({ hotel }) {
  const defaultPrimary = hotel?.businessLogo || hotel?.coverImage;
  const [primaryImage, setPrimaryImage] = useState(defaultPrimary);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Get all room images
  const roomImages = Array.isArray(hotel?.room)
    ? hotel.room.flatMap((r) =>
        r?.hotelRoomImages && r.hotelRoomImages.length
          ? r.hotelRoomImages
          : r?.hotelImages || []
      )
    : [];

  // Get all unique images including primary image
  const allImages = [primaryImage, ...roomImages].filter(Boolean);

  // Get secondary images (showing up to 4 secondary images)
  const secondary = allImages.length > 1 ? allImages.slice(1, 5) : [];

  // Calculate remaining images count
  const remainingImages = allImages.length > 5 ? allImages.length - 5 : 0;
  return (
    <div className="flex gap-4 mb-8">
      {/* Left side - Main large image */}
      <div className="w-2/3">
        <div className="relative w-full h-[600px]">
          <img
            src={primaryImage}
            alt={hotel?.hotelName || "Hotel Image"}
            className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={() => {
              setModalIndex(0);
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Right side - Grid of secondary images */}
      <div className="w-1/3 grid grid-cols-2 gap-2 max-h-[600px] overflow-y-auto">
        {allImages.map((src, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
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

      {/* Modal / Lightbox */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative w-full h-full max-w-6xl mx-auto py-8 flex flex-col">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-60 z-10"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close gallery"
            >
              ✕
            </button>

            {/* Main image display */}
            <div className="relative flex-1 w-full flex items-center justify-center mb-4">
              <img
                src={allImages[modalIndex]}
                alt={`Photo ${modalIndex + 1}`}
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg"
              />

              {/* Navigation buttons */}
              <button
                className="absolute left-4 text-white text-4xl px-4 py-2 bg-black bg-opacity-30 rounded-lg hover:bg-opacity-50"
                onClick={() =>
                  setModalIndex((i) => (i <= 0 ? allImages.length - 1 : i - 1))
                }
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                className="absolute right-4 text-white text-4xl px-4 py-2 bg-black bg-opacity-30 rounded-lg hover:bg-opacity-50"
                onClick={() =>
                  setModalIndex((i) => (i >= allImages.length - 1 ? 0 : i + 1))
                }
                aria-label="Next"
              >
                ›
              </button>
            </div>

            {/* Thumbnails list */}
            <div className="w-full overflow-x-auto">
              <div className="flex gap-2 justify-center min-w-min px-4">
                {allImages.map((src, idx) => (
                  <div
                    key={idx}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                      ${
                        modalIndex === idx
                          ? "border-blue-500 scale-105"
                          : "border-transparent hover:border-white/50"
                      }`}
                    onClick={() => setModalIndex(idx)}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Image counter */}
            <div className="text-center text-white mt-4">
              {modalIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
