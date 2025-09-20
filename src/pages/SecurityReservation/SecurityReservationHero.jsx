import React, { useState } from "react";
import { Link } from "react-router-dom"
import { DatePicker } from "antd";




export default function SecurityReservationHero() {
    const { RangePicker } = DatePicker;
    const [dateRange, setDateRange] = useState(null);
    const [location, setLocation] = useState("");
    const [securityType, setSecurityType] = useState("");

    const searchParams = () => {
        const params = new URLSearchParams();
        if (location) params.set("location", location);
        if (securityType) params.set("type", securityType);
        if (dateRange && dateRange[0] && dateRange[1]) {
            // antd v5 uses dayjs by default; these objects have .format()
            params.set("start", dateRange[0].format("YYYY-MM-DD"));
            params.set("end", dateRange[1].format("YYYY-MM-DD"));
        }
        return params.toString();
    };
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                            {/* Location Input */}
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Find Location"
                                    className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            {/* Start Date & End Date */}
                            <RangePicker
                                placeholder={['Start Date', 'End Date']}
                                value={dateRange}
                                onChange={setDateRange}
                                style={{ width: '100%' }}
                            />
                            {/* Security Type */}
                            <div className="space-y-2">

                                <select
                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                                    value={securityType}
                                    onChange={(e) => setSecurityType(e.target.value)}
                                >
                                    <option value="" disabled hidden>Select Security Type</option>
                                    <option value="Personal Bodyguard">Personal Bodyguard</option>
                                    <option value="Security Guard">Security Guard</option>
                                    <option value="Executive Protections">Executive Protections</option>
                                    <option value="Event Security">Event Security</option>
                                </select>
                            </div>

                        </div>
                        {/* Search Button */}
                        <div className="">
                            <Link to={`/security-details${searchParams() ? `?${searchParams()}` : ''}`} className="w-full">
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