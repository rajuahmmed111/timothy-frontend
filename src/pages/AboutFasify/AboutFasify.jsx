import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutFasify() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        About FASIFY
                    </h1>
                    <p className="mt-3 max-w-3xl mx-auto text-xl text-gray-500 sm:mt-5">
                        Your trusted partner for seamless travel and security solutions
                    </p>
                </div>

                <div className="mt-10">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Our Story</h2>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <p className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3">
                                    FASIFY was founded with a vision to revolutionize the way people experience travel and security services. 
                                    Our platform brings together hotel bookings, car rentals, attraction reservations, and professional 
                                    security services under one roof, providing convenience and peace of mind to our customers worldwide.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <p className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3">
                                    To provide exceptional, reliable, and secure travel experiences by connecting customers with the best 
                                    service providers while maintaining the highest standards of quality and customer satisfaction.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Why Choose FASIFY?</h2>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <ul className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3 space-y-4">
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Wide selection of hotels, cars, and attractions worldwide</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Professional security services for your peace of mind</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Secure and easy online booking process</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>24/7 customer support</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Competitive prices and exclusive deals</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ready to experience FASIFY?</h2>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
}
