import React, { useState } from "react";
export default function ImageGallery({ hotel }) {
  const defaultPrimary = hotel?.businessLogo;
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
            alt={hotel?.businessLogo?.[0] || "Hotel Image"}
            className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          
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

    
    </div>
  );
}
