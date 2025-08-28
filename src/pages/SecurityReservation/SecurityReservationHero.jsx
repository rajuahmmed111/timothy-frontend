import React from "react";
import { Link } from "react-router-dom"



export default function SecurityReservationHero() {
    return (
        <section
            className="relative h-[600px] bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/security/1.png')`,
            }}
        >
            <div className="container mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2 px-5 md:px-0 flex flex-col justify-end pb-10">
                <div>
                    <h1 className="text-7xl font-bold mb-10 text-white">Stay Protected Wherever You Go!!</h1>
                    {/* Custom Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            {/* Location Input */}
                            <div className="space-y-2">
                        
                                <input
                                    type="text"
                                    placeholder="Find Location"
                                    className="w-full p-3 border border-gray-200 rounded-lg"
                                />
                            </div>

                            {/* Guests and Rooms */}
                            <div className="space-y-2">
                        
                                <select className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option>Personal Bodyguard</option>
                                    <option>Security Guard</option>
                                    <option>Executive Protections</option>
                                    <option>Event Security</option>
                                </select>
                            </div>

                        </div>
                        {/* Search Button */}
                        <div className="">
                            <Link to="/security-details" className="w-full">
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