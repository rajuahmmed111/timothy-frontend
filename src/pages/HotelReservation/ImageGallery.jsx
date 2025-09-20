import React from 'react';
export default function ImageGallery() {
    const images = [
        {
            src: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
            alt: "Azure Oasis Resort Exterior",
            large: true
        },
        {
            src: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400",
            alt: "Resort Lobby"
        },
        {
            src: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400",
            alt: "Hotel Room"
        }
    ];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            <div className="col-span-2 row-span-2">
                <img
                    src={images[0].src}
                    alt={images[0].alt}
                    className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                />
            </div>
            {images.slice(1).map((image, index) => (
                <div key={index} className="relative group">
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-02 md:h-38 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                    />
                </div>
            ))}
        </div>
    );
}