import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Car, Calendar, MapPin, CreditCard, Download, Home, Users, Phone, Mail, Star, Fuel, Settings, Shield } from 'lucide-react';

export default function CarBookingConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingDetails } = location.state || {};

    // Enhanced booking data with defaults
    const booking = bookingDetails || {
        bookingId: 'CAR' + Math.floor(10000000 + Math.random() * 90000000),
        carName: 'Toyota Camry 2024',
        pickupDate: new Date().toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        location: 'Downtown Location',
        total: 150,
        paymentMethod: '•••• •••• •••• 4242',
        paymentStatus: 'completed'
    };

    // Car details
    const carDetails = {
        name: 'Toyota Camry 2024',
        category: 'Sedan',
        rating: 4.8,
        provider: 'Premium Car Rentals',
        location: 'Downtown Location - 123 Main Street',
        description: 'Comfortable and reliable sedan perfect for city driving and long trips',
        features: [
            'Automatic Transmission',
            'Air Conditioning',
            'GPS Navigation System',
            'Bluetooth Connectivity',
            'Backup Camera',
            'Cruise Control',
            'Power Windows & Locks',
            'USB Charging Ports'
        ],
        specifications: {
            seats: '5 Passengers',
            fuel: 'Gasoline',
            transmission: 'Automatic',
            mileage: 'Unlimited Miles'
        }
    };

    // Client details
    const clientDetails = {
        primaryDriver: {
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1 (555) 123-4567',
            licenseNumber: 'DL123456789'
        },
        additionalDriver: {
            name: 'Jane Smith',
            licenseNumber: 'DL987654321'
        },
        specialRequests: 'Child safety seat required',
        additionalNotes: 'Airport pickup preferred',
        emergencyContact: {
            name: 'Robert Smith',
            phone: '+1 (555) 987-6543'
        }
    };

    const handleDownloadReceipt = () => {
        // In a real app, this would generate and download a PDF receipt
        console.log('Downloading receipt for booking:', bookingDetails?.bookingId);
        alert('Receipt download functionality would be implemented here');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleBookAnother = () => {
        navigate('/car-reservation');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateDays = (start, end) => {
        const diffTime = Math.abs(new Date(end) - new Date(start));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-green-50 p-6 text-center border-b border-green-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                        <p className="text-gray-600">Your booking ID: {booking.bookingId}</p>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Car Details */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Car Details</h2>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{carDetails.name}</h3>
                                        <p className="text-gray-600">{carDetails.provider}</p>
                                        <div className="flex items-center mt-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(carDetails.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">{carDetails.rating}/5</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span className="text-sm">{carDetails.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">{carDetails.description}</p>
                                
                                {/* Car Specifications */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">{carDetails.specifications.seats}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Fuel className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">{carDetails.specifications.fuel}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Settings className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">{carDetails.specifications.transmission}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">{carDetails.specifications.mileage}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Information */}
                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Pickup Date</p>
                                            <p className="font-medium">{formatDate(booking.pickupDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Return Date</p>
                                            <p className="font-medium">{formatDate(booking.returnDate)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Car className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Rental Duration</p>
                                            <p className="font-medium">{calculateDays(booking.pickupDate, booking.returnDate)} day{calculateDays(booking.pickupDate, booking.returnDate) > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Pickup Location</p>
                                            <p className="font-medium">{booking.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Car Features */}
                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {carDetails.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-gray-600">
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Driver Information */}
                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Primary Driver</p>
                                            <p className="font-medium">{clientDetails.primaryDriver.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{clientDetails.primaryDriver.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{clientDetails.primaryDriver.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">License Number</p>
                                            <p className="font-medium">{clientDetails.primaryDriver.licenseNumber}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Additional Driver</p>
                                            <p className="font-medium">{clientDetails.additionalDriver.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">License Number</p>
                                            <p className="font-medium">{clientDetails.additionalDriver.licenseNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Special Requests</p>
                                            <p className="font-medium">{clientDetails.specialRequests}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Method</p>
                                            <p className="font-medium flex items-center">
                                                <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                                                {booking.paymentMethod}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <Phone className="w-5 h-5 text-red-600 mr-3" />
                                    <div>
                                        <p className="font-medium text-red-900">{clientDetails.emergencyContact.name}</p>
                                        <p className="text-red-700">{clientDetails.emergencyContact.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Rental Fee</span>
                                        <span className="font-medium">${booking.total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Security Deposit</span>
                                        <span className="font-medium">$0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Taxes & Fees</span>
                                        <span className="font-medium">Included</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                                            <span className="text-lg font-bold text-gray-900">${booking.total}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    <span className="text-sm">Payment completed successfully</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mt-5 px-6 pb-6">
                            <button
                                onClick={handleDownloadReceipt}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download Receipt
                            </button>
                            
                            <button
                                onClick={handleBackToHome}
                                className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center justify-center"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
