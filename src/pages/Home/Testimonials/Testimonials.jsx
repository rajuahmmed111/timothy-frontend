
import React from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { useState, useEffect } from "react"
import { useGetReviewsQuery } from '../../../redux/api/reviews/reviewsApi'
import Loader from '../../../shared/Loader/Loader'

export default function Testimonials() {
    const { data, isLoading } = useGetReviewsQuery();

    // Transform API data to match the testimonial format
    const testimonials = data?.data?.map((review, index) => ({
        id: review.id,
        name: `Guest ${index + 1}`, // Since we don't have user names in the response
        location: review.hotelId ? "Hotel Guest" : review.attractionId ? "Attraction Visitor" : review.carId ? "Car Rental Customer" : review.securityId ? "Security Service Client" : "Guest",
        text: review.comment,
        avatar: `https://avatar.iran.liara.run/public/${30 + (index % 20)}`, // Generate random avatars
        rating: review.rating,
        date: new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        verified: true
    })) || []

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

    if (isLoading) return <Loader />;

    // If no reviews, show a message
    if (!testimonials || testimonials.length === 0) {
        return (
            <section className="py-16 relative">
                <div className="container mx-auto px-5 md:px-0">
                    <div className="text-center py-10 text-gray-500">No reviews available yet.</div>
                </div>
            </section>
        );
    }

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
