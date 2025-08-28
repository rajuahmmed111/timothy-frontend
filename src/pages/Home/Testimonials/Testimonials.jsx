
import React from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { useState, useEffect } from "react"

export default function Testimonials() {
    const testimonials = [
        {
            name: "Giulia Rossi",
            location: "Rome, Italy",
            text: "The staff were incredibly welcoming and the room was spotless. I loved the local recommendations, they made my stay even more special!",
            avatar: "/woman-profile.png",
            rating: 5,
            date: "March 2024",
            verified: true
        },
        {
            name: "Andi Pratama",
            location: "Bali, Indonesia",
            text: "Amazing beach view and peaceful surroundings! Perfect for a honeymoon trip. We especially enjoyed the spa and sunset dinners.",
            avatar: "/man-profile.png",
            rating: 5,
            date: "February 2024",
            verified: true
        },
        {
            name: "Rebecca Thompson",
            location: "New York, USA",
            text: "A seamless check-in experience and top-notch service. I travel often for work, and this was one of the most comfortable stays I've had.",
            avatar: "/woman-business-profile.png",
            rating: 5,
            date: "January 2024",
            verified: true
        },
        {
            name: "Claire Dubois",
            location: "Paris, France",
            text: "Staying here felt like a dream. The location was ideal for exploring the city, and the breakfast croissants were unforgettable!",
            avatar: "/french-woman-profile.png",
            rating: 5,
            date: "December 2023",
            verified: true
        },
        {
            name: "Marco Silva",
            location: "Lisbon, Portugal",
            text: "Exceptional hospitality and breathtaking views! The concierge helped us discover hidden gems in the city. Truly a memorable experience.",
            avatar: "/man-profile.png",
            rating: 5,
            date: "November 2023",
            verified: true
        },
        {
            name: "Sophie Chen",
            location: "Singapore",
            text: "Modern amenities with a personal touch. The rooftop pool was amazing and the staff went above and beyond to make our anniversary special.",
            avatar: "/woman-profile.png",
            rating: 5,
            date: "October 2023",
            verified: true
        },
    ]

    const [translateX, setTranslateX] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    // Create duplicated testimonials for infinite scroll
    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials]

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                setTranslateX(prev => {
                    const cardWidth = 320 // Approximate card width including padding
                    const newTranslateX = prev - 1

                    // Reset position when we've scrolled through one full set
                    if (Math.abs(newTranslateX) >= cardWidth * testimonials.length) {
                        return 0
                    }
                    return newTranslateX
                })
            }, 20) // Smooth animation with 20ms intervals

            return () => clearInterval(interval)
        }
    }, [isHovered, testimonials.length])

    return (
        <section className="py-16 relative">
            <div className="container mx-auto px-5 md:px-0">
                {/* Section Header */}
                <div className="mb-12 text-center lg:text-left ">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        What Our Happy Guests Are Saying
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
                        From unforgettable experiences to world-class service, our guests share their real stories of joy, comfort, and adventure.                    </p>
                </div>

                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="relative overflow-hidden z-10">
                        <div
                            className="flex"
                            style={{
                                transform: `translateX(${translateX}px)`,
                                width: 'max-content',
                            }}
                        >
                            {duplicatedTestimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="px-3 flex-shrink-0"
                                    style={{ width: '320px' }}
                                >
                                    {/* Enhanced Custom Card */}
                                    <div className="relative p-5 bg-[#F7F7F7] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border border-gray-100">
                                        {/* Quote Icon */}
                                        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity z-10">
                                            <Quote className="w-8 h-8 text-blue-500" />
                                        </div>

                                        <div className="mt-8">
                                            {/* Location */}
                                            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                                                {testimonial.location}
                                            </h3>

                                            {/* Testimonial Text */}
                                            <p className="text-gray-600 mb-6 text-sm leading-relaxed italic">
                                                "{testimonial.text}"
                                            </p>
                                        </div>

                                        {/* User Info */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                            <div className="relative z-20">
                                                <img
                                                    src={testimonial.avatar || "/placeholder.svg"}
                                                    alt={testimonial.name}
                                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 relative z-10"
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-20"></div>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900 block">
                                                    {testimonial.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Verified Guest
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Speed Control Buttons */}
                    <div className="flex justify-center mt-10 space-x-4 relative z-40">
                        <button
                            onClick={() => setTranslateX(prev => prev + 50)}
                            className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 relative z-50 hover:z-[60]"
                            aria-label="Slow down scroll"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {/* <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 flex items-center">
                            {isHovered ? 'Paused' : 'Auto-scrolling'}
                        </div> */}
                        <button
                            onClick={() => setTranslateX(prev => prev - 50)}
                            className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 relative z-50 hover:z-[60]"
                            aria-label="Speed up scroll"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

        </section>
    )
}
