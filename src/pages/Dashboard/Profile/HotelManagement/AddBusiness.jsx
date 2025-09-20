import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function AddBusiness() {
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: '',
        email: '',
        governmentRegistrationNumber: '',
        phone: '',
        businessSignUp: '',
        businessDescription: '',
        uploadFromFiles: '',
        packingCheckerType: '',
        pricing: '',
        brandingOptions: '',
        shipping: '',
        businessType2: '',
        sellOnline: '',
        marketingNeeds: '',
        socialMedia: '',
        urbanHeatPlanning: '',
        metroAssociatesLicenses: '',
        policyGovernmentsLicense: '',
        dateOfBusinessRegistration: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const RadioGroup = ({ label, name, value, onChange }) => (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <label className="text-sm text-gray-700 font-medium">{label}</label>
            <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value="yes"
                        checked={value === 'yes'}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value="no"
                        checked={value === 'no'}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">No</span>
                </label>
            </div>
        </div>
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const AmenityRadioGroup = ({ label, name, value, onChange }) => (
        <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 font-medium">{label}</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-1 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value="yes"
                        checked={value === 'yes'}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Yes</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value="no"
                        checked={value === 'no'}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">No</span>
                </label>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="divide-y divide-gray-100">

                        {/* Business Details Section */}
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-6">
                                <Building2 className="w-6 h-6 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Business Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessName}
                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter business name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessName}
                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter business name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Type
                                    </label>
                                    <select
                                        value={formData.businessType}
                                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select business type</option>
                                        <option value="retail">Retail</option>
                                        <option value="service">Service</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="technology">Technology</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Government Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.governmentRegistrationNumber}
                                        onChange={(e) => handleInputChange('governmentRegistrationNumber', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter registration number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Business Registration (DOB)
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dateOfBusinessRegistration}
                                        onChange={(e) => handleInputChange('dateOfBusinessRegistration', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Date"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Logo & Description Section */}
                        <div className="p-5">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Logo & Description</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Tagline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessSignUp}
                                        onChange={(e) => handleInputChange('businessSignUp', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter business sign-up details"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload From Device
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Description
                                    </label>
                                    <textarea
                                        value={formData.businessDescription}
                                        onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Describe your business..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Create Listings Section */}
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Create Listings</h2>
                                <p className="text-sm text-gray-500 mt-1">Please provide business information to setup your account.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Room/Apartment Type
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.roomApartmentType}
                                            onChange={(e) => handleInputChange('roomApartmentType', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Select"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Booking Condition
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.bookingCondition}
                                            onChange={(e) => handleInputChange('bookingCondition', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Room Description
                                        </label>
                                        <textarea
                                            value={formData.roomDescription}
                                            onChange={(e) => handleInputChange('roomDescription', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.postalCode}
                                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Room Picture
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city2}
                                            onChange={(e) => handleInputChange('city2', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Room Picture
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price Per Night
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.pricePerNight}
                                            onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cancellation Policy
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cancellationPolicy}
                                            onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District/ State/ Province
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.districtStateProvince}
                                            onChange={(e) => handleInputChange('districtStateProvince', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Policy Documents Upload
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.country2}
                                            onChange={(e) => handleInputChange('country2', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Policy Documents Upload
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Amenities Section */}
                            <div className="mt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    <AmenityRadioGroup
                                        label="AC"
                                        name="ac"
                                        value={formData.ac}
                                        onChange={(value) => handleInputChange('ac', value)}
                                    />

                                    <AmenityRadioGroup
                                        label="Parking"
                                        name="parking"
                                        value={formData.parking}
                                        onChange={(value) => handleInputChange('parking', value)}
                                    />

                                    <AmenityRadioGroup
                                        label="WiFi"
                                        name="wifi"
                                        value={formData.wifi}
                                        onChange={(value) => handleInputChange('wifi', value)}
                                    />

                                    <AmenityRadioGroup
                                        label="Breakfast"
                                        name="breakfast"
                                        value={formData.breakfast}
                                        onChange={(value) => handleInputChange('breakfast', value)}
                                    />

                                    <AmenityRadioGroup
                                        label="Swimming Pool"
                                        name="swimmingPool"
                                        value={formData.swimmingPool}
                                        onChange={(value) => handleInputChange('swimmingPool', value)}
                                    />

                                    <AmenityRadioGroup
                                        label="Smoking"
                                        name="smoking"
                                        value={formData.smoking}
                                        onChange={(value) => handleInputChange('smoking', value)}
                                    />

                                    <AmenityRadioGroup
                                        label="TV"
                                        name="tv"
                                        value={formData.tv}
                                        onChange={(value) => handleInputChange('tv', value)}
                                    />

                                    <AmenityRadioGroup
                                        label="Washing Machine"
                                        name="washingMachine"
                                        value={formData.washingMachine}
                                        onChange={(value) => handleInputChange('washingMachine', value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="p-6 bg-gray-50">
                            <Link to="/dashboard/review-business">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Next
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}