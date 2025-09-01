import React from 'react'
import { Link } from 'react-router-dom';
import img1 from '/RecommendedAttractions/1.png';
import EventCard from './EventCard';

export default function AttractionsDetailsPage() {
    const events = [
        {
            name: "Dubai Shopping Festival",
            location: "Dubai Mall",
            image: img1,
            price: "$150",
            rating: 5,
        },
        {
            name: "Global Village Carnival",
            location: "Global Village, Dubai",
            image: img1,
            price: "$80",
            rating: 4.9,
        },
        {
            name: "Duba1i Food Festival",
            location: "Jumeirah Beach",
            image: img1,
            price: "$100",
            rating: 4.8,
        },
        {
            name: "Dubai International Boat Show",
            location: "Dubai Harbour",
            image: img1,
            price: "$200",
            rating: 5,
        },
        {
            name: "Taste of Dubai",
            location: "Dubai Media City Amphitheatre",
            image: img1,
            price: "$120",
            rating: 4.7,
        },
        {
            name: "Dubai Opera Night",
            location: "Dubai Opera House",
            image: img1,
            price: "$250",
            rating: 4.9,
        },
        {
            name: "Dubai International Film Festival",
            location: "Madinat Jumeirah",
            image: img1,
            price: "$300",
            rating: 5,
        },
        {
            name: "Dubai Jazz Festival",
            location: "Dubai Media City",
            image: img1,
            price: "$180",
            rating: 4.8,
        },
        {
            name: "Dubai Summer Surprises",
            location: "Mall of the Emirates",
            image: img1,
            price: "$90",
            rating: 4.7,
        },
        {
            name: "Dubai Desert Safari Festival",
            location: "Dubai Desert",
            image: img1,
            price: "$140",
            rating: 4.9,
        },
        {
            name: "Dubai Sports World",
            location: "Dubai World Trade Centre",
            image: img1,
            price: "$60",
            rating: 4.6,
        },
        {
            name: "Dubai International Horse Fair",
            location: "Dubai World Trade Centre",
            image: img1,
            price: "$220",
            rating: 5,
        },
        {
            name: "Dubai Canvas Art Festival",
            location: "City Walk, Dubai",
            image: img1,
            price: "$70",
            rating: 4.7,
        },
        {
            name: "Dubai Fitness Challenge",
            location: "Dubai Marina",
            image: img1,
            price: "$50",
            rating: 4.8,
        },
        {
            name: "Dubai Polo Gold Cup",
            location: "Dubai Polo & Equestrian Club",
            image: img1,
            price: "$180",
            rating: 5,
        },
        {
            name: "Dubai International Jewellery Show",
            location: "Dubai World Trade Centre",
            image: img1,
            price: "$260",
            rating: 4.9,
        },
        {
            name: "Dubai International Arabian Horse Championship",
            location: "Dubai International Convention Centre",
            image: img1,
            price: "$200",
            rating: 5,
        },
        {
            name: "Dubai Fashion Week",
            location: "Dubai Design District",
            image: img1,
            price: "$300",
            rating: 4.8,
        },
        {
            name: "Dubai Marathon",
            location: "Downtown Dubai",
            image: img1,
            price: "$90",
            rating: 4.7,
        },
        {
            name: "Dubai Beach Music Festival",
            location: "JBR Beach",
            image: img1,
            price: "$150",
            rating: 4.9,
        },
        {
            name: "Dubai Food Carnival",
            location: "Dubai Creek Harbour",
            image: img1,
            price: "$110",
            rating: 4.7,
        },
        {
            name: "Dubai Future Tech Summit",
            location: "Dubai Exhibition Centre",
            image: img1,
            price: "$350",
            rating: 5,
        },
        {
            name: "Dubai Science Festival",
            location: "Dubai Knowledge Park",
            image: img1,
            price: "$80",
            rating: 4.8,
        },
        {
            name: "Dubai International Robotics Expo",
            location: "Dubai Silicon Oasis",
            image: img1,
            price: "$400",
            rating: 5,
        },
        {
            name: "Dubai Kite Festival",
            location: "Jumeirah Beach Park",
            image: img1,
            price: "$60",
            rating: 4.7,
        },
        {
            name: "Dubai Opera Classical Nights",
            location: "Dubai Opera House",
            image: img1,
            price: "$280",
            rating: 5,
        },
        {
            name: "Dubai International Art Fair",
            location: "Dubai World Trade Centre",
            image: img1,
            price: "$220",
            rating: 4.8,
        },
        {
            name: "Dubai Drone Racing Championship",
            location: "Dubai Sports City",
            image: img1,
            price: "$190",
            rating: 4.9,
        },
        {
            name: "Dubai International AI Conference",
            location: "Dubai Exhibition Centre",
            image: img1,
            price: "$500",
            rating: 5,
        },
        {
            name: "Dubai Beach Volleyball Cup",
            location: "Jumeirah Beach Residence",
            image: img1,
            price: "$120",
            rating: 4.8,
        },
    ];

    return (
        <div className="min-h-screen py-10 container mx-auto">
            <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
                <div className="mb-5">
                    {/* Location Input */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Search For Attractions"
                            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400"
                        />
                    </div>
                </div>
                {/* Search Button */}
                <div className="">
                    <Link to="" className="w-full">
                        <button className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
                            Search
                        </button>
                    </Link>
                </div>
            </div>
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                {events.map((event, index) => (
                    <EventCard key={index} event={event} />
                ))}
            </div>
        </div>
    );
}