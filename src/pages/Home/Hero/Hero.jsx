import React from "react";
import { CalendarDays, MapPin, Users } from "lucide-react"
import { Link } from "react-router-dom"

export default function Hero() {
    return (
        <section
            className="relative h-[600px] bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/hotel.png')`,
            }}
        >
            <div className="container mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2 px-5 flex flex-col justify-end pb-10">
                <div>
                    <h1 className="text-7xl font-bold mb-10 text-white">Easy To Book Your Stays!</h1>
                    {/* Custom Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                            {/* Location Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter destination"
                                    className="w-full p-3 border border-gray-200 rounded-lg"
                                />
                            </div>

                            {/* Check-in & Check-out */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4" />
                                    Check-in and Check-Out
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400"
                                />
                            </div>

                            {/* Guests and Rooms */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Guests and Rooms
                                </label>
                                <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>2 Guests, 1 Room</option>
                                    <option>4 Guests, 2 Rooms</option>
                                    <option>6 Guests, 3 Rooms</option>
                                    <option>8 Guests, 4 Rooms</option>
                                </select>
                            </div>

                        </div>
                        {/* Search Button */}
                        <div className="">
                            <Link to="/hotel" className="w-full">
                                <button className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
                                    Search
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
