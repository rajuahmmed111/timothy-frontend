import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
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
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Logo & Description</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Sign-Up
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
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Listings</h2>

                            <div className="space-y-1">
                                <RadioGroup
                                    label="Receive/Checker Type"
                                    name="packingCheckerType"
                                    value={formData.packingCheckerType}
                                    onChange={(value) => handleInputChange('packingCheckerType', value)}
                                />

                                <RadioGroup
                                    label="Free File Right"
                                    name="uploadFromFiles"
                                    value={formData.uploadFromFiles}
                                    onChange={(value) => handleInputChange('uploadFromFiles', value)}
                                />

                                <RadioGroup
                                    label="Aly"
                                    name="pricing"
                                    value={formData.pricing}
                                    onChange={(value) => handleInputChange('pricing', value)}
                                />

                                <RadioGroup
                                    label="Branding Options"
                                    name="brandingOptions"
                                    value={formData.brandingOptions}
                                    onChange={(value) => handleInputChange('brandingOptions', value)}
                                />

                                <RadioGroup
                                    label="Shipping Options"
                                    name="shipping"
                                    value={formData.shipping}
                                    onChange={(value) => handleInputChange('shipping', value)}
                                />

                                <RadioGroup
                                    label="Marketing Needs"
                                    name="marketingNeeds"
                                    value={formData.marketingNeeds}
                                    onChange={(value) => handleInputChange('marketingNeeds', value)}
                                />

                                <RadioGroup
                                    label="Social Media"
                                    name="socialMedia"
                                    value={formData.socialMedia}
                                    onChange={(value) => handleInputChange('socialMedia', value)}
                                />

                                <RadioGroup
                                    label="Online Bank Reserve"
                                    name="sellOnline"
                                    value={formData.sellOnline}
                                    onChange={(value) => handleInputChange('sellOnline', value)}
                                />

                                <RadioGroup
                                    label="Gallery"
                                    name="businessType2"
                                    value={formData.businessType2}
                                    onChange={(value) => handleInputChange('businessType2', value)}
                                />

                                <RadioGroup
                                    label="Upload Heat Planning"
                                    name="urbanHeatPlanning"
                                    value={formData.urbanHeatPlanning}
                                    onChange={(value) => handleInputChange('urbanHeatPlanning', value)}
                                />

                                <RadioGroup
                                    label="Metro Associates License"
                                    name="metroAssociatesLicenses"
                                    value={formData.metroAssociatesLicenses}
                                    onChange={(value) => handleInputChange('metroAssociatesLicenses', value)}
                                />

                                <RadioGroup
                                    label="Policy Government License"
                                    name="policyGovernmentsLicense"
                                    value={formData.policyGovernmentsLicense}
                                    onChange={(value) => handleInputChange('policyGovernmentsLicense', value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="p-6 bg-gray-50">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}