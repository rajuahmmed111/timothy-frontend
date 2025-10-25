import React, { useState } from "react";
import { Link } from "react-router-dom"
import { DatePicker } from "antd";


export default function CarReservationHero() {
    const [dateRange, setDateRange] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { RangePicker } = DatePicker;
    return (
        <section
            className="relative h-[600px] bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/car/car.png')`,
            }}
        >
            <div className="container mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2 px-5 md:px-0 flex flex-col justify-end pb-10">
                <div>
                    <h1 className="text-7xl font-bold mb-10 text-white">Rent A Car Anytime Anywhere</h1>
                    {/* Custom Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Find Location"
                                    className="w-full p-3 border border-gray-200 rounded-lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {/* Check-in & Check-out */}
                            <RangePicker
                                placeholder={['Start Date', 'End Date']}
                                value={dateRange}
                                onChange={setDateRange}
                                style={{ width: '100%' }}
                            />
                        </div>
                        {/* Search Button */}
                        <div className="">
                            <Link
                                to={(() => {
                                    const params = new URLSearchParams();
                                    if (searchTerm) params.set('searchTerm', searchTerm);
                                    if (dateRange?.[0]) params.set('fromDate', dateRange[0].format('YYYY-MM-DD'));
                                    if (dateRange?.[1]) params.set('toDate', dateRange[1].format('YYYY-MM-DD'));
                                    const qs = params.toString();
                                    return qs ? `/car-details?${qs}` : '/car-details';
                                })()}
                                className="w-full"
                            >
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