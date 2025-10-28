import React from 'react';
export default function ImageGallery({ hotel }) {
    const primary = hotel?.businessLogo || hotel?.coverImage || "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800";
    const roomImages = Array.isArray(hotel?.room)
        ? hotel.room.flatMap(r => (r?.hotelRoomImages && r.hotelRoomImages.length ? r.hotelRoomImages : (r?.hotelImages || [])))
        : [];
    const secondary = roomImages.length > 0
        ? roomImages.slice(0, 2)
        : [
            "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400",
        ];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            <div className="col-span-2 row-span-2">
                <img
                    src={primary}
                    alt={hotel?.hotelName || 'Hotel Image'}
                    className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                />
            </div>
            {secondary.map((src, index) => (
                <div key={index} className="relative group">
                    <img
                        src={src}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-02 md:h-38 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                    />
                </div>
            ))}
        </div>
    );
}