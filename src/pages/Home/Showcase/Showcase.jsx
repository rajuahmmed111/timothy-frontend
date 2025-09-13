import React from 'react';
import { Star } from 'lucide-react';

export default function Showcase() {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700">
            {/* App Download Section */}
            <section className="py-6 md:py-8 px-4 md:px-6">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                        {/* Left side - Menu icon */}
                        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 items-center'>
                            <div className="flex items-center">
                                <img src="/Group.png" alt="" className="w-auto h-8 md:h-10" />
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                {/* Star Rating */}
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className="w-5 h-5 md:w-6 md:h-6 fill-orange-400 text-orange-400"
                                        />
                                    ))}
                                </div>

                                {/* Rating Text */}
                                <div className="text-white text-center">
                                    <span className="text-sm md:text-lg font-medium">Rating: 5 - 33 Review</span>
                                </div>
                            </div>
                        </div>

                        {/* Right side - App Store Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                            {/* App Store Button */}
                            <a
                                href="#"
                                className="bg-black hover:bg-gray-900 transition-colors duration-200 rounded-lg px-3 md:px-4 py-2 flex items-center space-x-2 md:space-x-3 w-full sm:w-auto justify-center"
                            >
                                <div className="text-white">
                                    <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                </div>
                                <div className="text-white">
                                    <div className="text-xs">Download on the</div>
                                    <div className="text-sm md:text-lg font-semibold -mt-1">App Store</div>
                                </div>
                            </a>

                            {/* Google Play Button */}
                            <a
                                href="#"
                                className="bg-black hover:bg-gray-900 transition-colors duration-200 rounded-lg px-3 md:px-4 py-2 flex items-center space-x-2 md:space-x-3 w-full sm:w-auto justify-center"
                            >
                                <div className="text-white">
                                    <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                </div>
                                <div className="text-white">
                                    <div className="text-xs">Get It On</div>
                                    <div className="text-sm md:text-lg font-semibold -mt-1">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}