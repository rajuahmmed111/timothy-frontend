import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Users, Wifi, Car, Coffee, Tv, Wind, Waves } from "lucide-react"
import img1 from '/burj.png';

export default function EventReservationPage() {
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [guests, setGuests] = useState("1")

    const generateDates = () => {
        const dates = []
        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()

        for (let i = 1; i <= 30; i++) {
            const date = new Date(currentYear, currentMonth, i)
            dates.push({
                day: date.toLocaleDateString("en-US", { weekday: "short" }),
                date: date.getDate(),
                fullDate: date.toISOString().split("T")[0],
            })
        }
        return dates
    }

    const dates = generateDates()

    const timeSlots = [
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
    ]

    const images = [
        img1,
        img1,
        img1,
    ]

    const amenities = [
        { icon: Wifi, label: "Free WiFi" },
        { icon: Car, label: "Free parking" },
        { icon: Coffee, label: "Kitchen" },
        { icon: Tv, label: "TV" },
        { icon: Wind, label: "Air conditioning" },
        { icon: Waves, label: "Pool" },
    ]

    const ratingDistribution = [
        { stars: 5, count: 98, percentage: 77 },
        { stars: 4, count: 22, percentage: 17 },
        { stars: 3, count: 6, percentage: 5 },
        { stars: 2, count: 1, percentage: 1 },
        { stars: 1, count: 1, percentage: 1 },
    ]

    return (
        <div className="min-h-screen container mx-auto px-5 md:px-0 py-10">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Burj Khalifa: Floors 124 & 125</h1>
                <p className="text-gray-600">A ticket to visit Dubai from the top of the Burj Khalifa skyscraper</p>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="font-medium">4.8</span>
                        <span className="text-gray-600">(128 reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-600">Dubai, UAE</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images and Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Gallery */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                        <div className="col-span-2 row-span-2">
                            <img
                                src={images[0] || "/placeholder.svg"}
                                alt="Burj Khalifa Main View"
                                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            />
                        </div>
                        {images.slice(1).map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Burj Khalifa View ${index + 2}`}
                                    className="w-full h-32 md:h-38 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Description</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Visit the iconic Burj Khalifa, the world's tallest building, and experience breathtaking views of Dubai
                            from floors 124 and 125. This unforgettable experience offers panoramic views of the city, desert, and
                            ocean. The observation decks feature floor-to-ceiling windows and outdoor terraces, providing the perfect
                            vantage point to see Dubai's stunning skyline and landmarks.
                        </p>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3">What this place offers</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {amenities.map((amenity, index) => {
                                const IconComponent = amenity.icon;
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <IconComponent className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm">{amenity.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Reviews</h2>

                        <div className="mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-current text-yellow-500" />
                                    <span className="text-2xl font-bold">4.8</span>
                                </div>
                                <div className="text-gray-600">
                                    <span className="font-medium">128</span> reviews
                                </div>
                            </div>

                            <div className="space-y-2">
                                {ratingDistribution.map((rating) => (
                                    <div key={rating.stars} className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 w-12">
                                            <span className="text-sm">{rating.stars}</span>
                                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-500 h-2 rounded-full"
                                                    style={{ width: `${rating.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 w-8 text-right">{rating.count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        S
                                    </div>
                                    <div>
                                        <p className="font-medium">Sarah</p>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Amazing experience! The views from the top are absolutely breathtaking. Well organized and the staff
                                    was very helpful.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Booking Form */}
                <div className="lg:col-span-1 pb-10">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-2xl font-bold">$600</span>
                            <span className="text-sm text-gray-600">per person</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium mb-3 block">SELECT DATE</label>
                                <div className="relative">
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {dates.map((dateItem, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedDate(dateItem.fullDate)}
                                                className={`flex-shrink-0 flex flex-col items-center justify-center w-12 h-16 rounded-lg border transition-all ${selectedDate === dateItem.fullDate
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white hover:bg-gray-50 border-gray-200"
                                                    }`}
                                            >
                                                <span className="text-xs font-medium">{dateItem.day}</span>
                                                <span className="text-sm font-bold">{dateItem.date}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <label className="text-xs font-medium mb-3 block">SELECT TIME:</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${selectedTime === time
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white hover:bg-gray-50 border-gray-200"
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Guests */}
                            <div>
                                <label htmlFor="guests" className="text-xs font-medium block mb-1">
                                    GUESTS
                                </label>
                                <select
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                                >
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={String(i + 1)}>
                                            {i + 1} guest{i > 0 ? "s" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                onClick={() => {
                                    const bookingDetails = {
                                        bookingId: 'EVT' + Math.floor(10000000 + Math.random() * 90000000),
                                        eventName: 'Burj Khalifa: Floors 124 & 125',
                                        location: 'Dubai, UAE',
                                        selectedDate,
                                        selectedTime,
                                        guests,
                                        total: 600 * parseInt(guests) + 50
                                    };
                                    navigate('/event/checkout', { state: { bookingDetails } });
                                }}
                                disabled={!selectedDate || !selectedTime}
                                className={`w-full bg-[#0064D2] text-white py-3 px-6 rounded-lg font-medium transition-colors ${
                                    !selectedDate || !selectedTime 
                                        ? 'opacity-70 cursor-not-allowed' 
                                        : 'hover:bg-blue-700'
                                }`}
                            >
                                Continue to Checkout
                            </button>


                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Price Breakdown */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>
                                        $600 x {guests} guest{parseInt(guests) > 1 ? "s" : ""}
                                    </span>
                                    <span>${600 * parseInt(guests)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Service fee</span>
                                    <span>$50</span>
                                </div>
                                <div className="border-t border-gray-200 my-2"></div>
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>${600 * parseInt(guests) + 50}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
