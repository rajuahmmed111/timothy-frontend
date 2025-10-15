import React, { useState } from 'react';
import { Building2, Upload, X, FileText } from 'lucide-react';
import { useAddHotelBusinessMutation } from '../../../../redux/api/hotel/addHotelBusinessApi';
import Swal from 'sweetalert2';

export default function AddHotelBusiness() {
const [formData, setFormData] = useState({
    hotelBusinessName: '',
    hotelName: '',
    hotelBusinessType: 'Private Limited',
    hotelRegNum: '',
    hotelRegDate: '',
    hotelPhone: '',
    hotelEmail: '',
    businessTagline: '',
    businessDescription: '',
    hotelBookingCondition: '',
    hotelCancelationPolicy: '',
    hotelLate: '',
    hotelLong: '',
    hotelAccommodationType: '5-Star Luxury',
    // Boolean fields
    hotelAC: false,
    hotelParking: false,
    hoitelWifi: false,
    hotelBreakfast: false,
    hotelPool: false,
    hotelSmoking: false,
    hotelTv: false,
    hotelWashing: false,
    hotelKitchen: false,
    hotelRestaurant: false,
    hotelGym: false,
    hotelSpa: false,
    hotel24HourFrontDesk: false,
    hotelAirportShuttle: false,
    hotelNoSmokingPreference: false,
    hotelNoNSmoking: false,
    hotelPetsAllowed: false,
    hotelNoPetsPreferences: false,
    hotelPetsNotAllowed: false,
    hotelLocationFeatureWaterView: false,
    hotelLocationFeatureIsland: false,
    hotelCoffeeBar: false,
    // File states
    businessLogo: null,
    hotelDocs: []
});

    const [preview, setPreview] = useState({
        businessLogo: null,
        hotelDocs: []
    });

    const [addHotelBusiness, { isLoading }] = useAddHotelBusinessMutation();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (field, e) => {
        const files = Array.from(e.target.files);
        
        if (field === 'businessLogo') {
            const file = files[0];
            if (file) {
                setFormData(prev => ({ ...prev, [field]: file }));
                setPreview(prev => ({
                    ...prev,
                    [field]: URL.createObjectURL(file)
                }));
            }
        } else if (field === 'hotelDocs') {
            setFormData(prev => ({
                ...prev,
                hotelDocs: [...prev.hotelDocs, ...files]
            }));
            setPreview(prev => ({
                ...prev,
                hotelDocs: [
                    ...prev.hotelDocs,
                    ...files.map(file => URL.createObjectURL(file))
                ]
            }));
        }
    };

    const removeFile = (field, index = null) => {
        if (field === 'businessLogo') {
            setFormData(prev => ({ ...prev, [field]: null }));
            setPreview(prev => ({ ...prev, [field]: null }));
        } else if (field === 'hotelDocs' && index !== null) {
            const updatedDocs = [...formData.hotelDocs];
            const updatedPreviews = [...preview.hotelDocs];
            updatedDocs.splice(index, 1);
            updatedPreviews.splice(index, 1);
            
            setFormData(prev => ({ ...prev, hotelDocs: updatedDocs }));
            setPreview(prev => ({ ...prev, hotelDocs: updatedPreviews }));
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const swalInstance = Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we save your hotel details',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const formDataToSend = new FormData();
        
        // Append all form data
        Object.entries(formData).forEach(([key, value]) => {
            if (value === null || value === '') return;
            
            if (key === 'hotelDocs') {
                value.forEach(file => {
                    formDataToSend.append('hotelDocs', file);
                });
            } else if (value instanceof File) {
                formDataToSend.append(key, value);
            } else {
                formDataToSend.append(key, value);
            }
        });

        // Ensure all boolean fields are included
        const booleanFields = [
            'hotelAC', 'hotelParking', 'hoitelWifi', 'hotelBreakfast',
            'hotelPool', 'hotelSmoking', 'hotelTv', 'hotelWashing',
            'hotelKitchen', 'hotelRestaurant', 'hotelGym', 'hotelSpa',
            'hotel24HourFrontDesk', 'hotelAirportShuttle', 'hotelNoSmokingPreference',
            'hotelNoNSmoking', 'hotelPetsAllowed', 'hotelNoPetsPreferences',
            'hotelPetsNotAllowed', 'hotelLocationFeatureWaterView',
            'hotelLocationFeatureIsland', 'hotelCoffeeBar'
        ];

        booleanFields.forEach(field => {
            if (!formDataToSend.has(field)) {
                formDataToSend.append(field, 'false');
            }
        });

        const response = await addHotelBusiness(formDataToSend).unwrap();
        
        // ... rest of your success handling code ...
        await swalInstance.close();

        if (response?.success) {
            await Swal.fire({
                title: 'Success!',
                text: response.message || 'Hotel business added successfully',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#4f46e5',
            });

            // Reset form
            const resetForm = {
                hotelBusinessName: '',
                hotelName: '',
                hotelBusinessType: 'Private Limited',
                hotelRegNum: '',
                hotelRegDate: '',
                hotelPhone: '',
                hotelEmail: '',
                businessTagline: '',
                businessDescription: '',
                hotelBookingCondition: '',
                hotelCancelationPolicy: '',
                hotelLate: '',
                hotelLong: '',
                hotelAccommodationType: '5-Star Luxury',
                // Reset boolean fields
                hotelAC: false,
                hotelParking: false,
                hoitelWifi: false,
                hotelBreakfast: false,
                hotelPool: false,
                hotelSmoking: false,
                hotelTv: false,
                hotelWashing: false,
                hotelKitchen: false,
                hotelRestaurant: false,
                hotelGym: false,
                hotelSpa: false,
                hotel24HourFrontDesk: false,
                hotelAirportShuttle: false,
                hotelNoSmokingPreference: false,
                hotelNoNSmoking: false,
                hotelPetsAllowed: false,
                hotelNoPetsPreferences: false,
                hotelPetsNotAllowed: false,
                hotelLocationFeatureWaterView: false,
                hotelLocationFeatureIsland: false,
                hotelCoffeeBar: false,
                // Reset file states
                businessLogo: null,
                hotelDocs: []
            };
            
            setFormData(resetForm);
            setPreview({
                businessLogo: null,
                hotelDocs: []
            });
            
            // Reset file inputs
            document.querySelectorAll('input[type="file"]').forEach(input => {
                input.value = '';
            });
        }
    } catch (error) {
        await swalInstance.close();
        
        await Swal.fire({
            title: 'Error!',
            text: error?.data?.message || 'Failed to add hotel business',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444',
        });
    }
};

    const renderFilePreview = (file, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700 truncate max-w-xs">
                    {file.name}
                </span>
            </div>
            <button
                type="button"
                onClick={() => removeFile('hotelDocs', index)}
                className="text-red-500 hover:text-red-700"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className=" mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
                        {/* Header */}
                        <div className="p-6 bg-gray-50 border-b">
                            <div className="flex items-center gap-3">
                                <Building2 className="w-6 h-6 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Add Hotel Business</h2>
                            </div>
                        </div>

                        {/* Main Form */}
                        <div className="p-6 space-y-6">
                            {/* Business Information */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.hotelBusinessName}
                                            onChange={(e) => handleInputChange('hotelBusinessName', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Royal Grand Hotel Ltd."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hotel Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.hotelName}
                                            onChange={(e) => handleInputChange('hotelName', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Royal Grand Hotel"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            required
                                            value={formData.hotelBusinessType}
                                            onChange={(e) => handleInputChange('hotelBusinessType', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Private Limited">Private Limited</option>
                                            <option value="Public Limited">Public Limited</option>
                                            <option value="Partnership">Partnership</option>
                                            <option value="Sole Proprietorship">Sole Proprietorship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.hotelRegNum}
                                            onChange={(e) => handleInputChange('hotelRegNum', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="REG-2025-12345"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Registration Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.hotelRegDate}
                                            onChange={(e) => handleInputChange('hotelRegDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.hotelPhone}
                                            onChange={(e) => handleInputChange('hotelPhone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="+8801777888999"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.hotelEmail}
                                            onChange={(e) => handleInputChange('hotelEmail', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="contact@royalgrand.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Tagline
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessTagline}
                                            onChange={(e) => handleInputChange('businessTagline', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Luxury & Comfort at Your Service"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Description
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.businessDescription}
                                            onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Describe your hotel business..."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Booking Conditions
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={formData.hotelBookingCondition}
                                            onChange={(e) => handleInputChange('hotelBookingCondition', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Check-in after 2 PM, Check-out before 12 PM. ID verification required."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cancellation Policy
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={formData.hotelCancelationPolicy}
                                            onChange={(e) => handleInputChange('hotelCancelationPolicy', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Free cancellation up to 48 hours before check-in. After that, one night charge will apply."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData.hotelLate}
                                            onChange={(e) => handleInputChange('hotelLate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., 2.33"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Longitude
                                        </label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData.hotelLong}
                                            onChange={(e) => handleInputChange('hotelLong', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., 2.4"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Accommodation Type
                                        </label>
                                        <select
                                            value={formData.hotelAccommodationType}
                                            onChange={(e) => handleInputChange('hotelAccommodationType', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="5-Star Luxury">5-Star Luxury</option>
                                            <option value="4-Star">4-Star</option>
                                            <option value="3-Star">3-Star</option>
                                            <option value="Boutique">Boutique Hotel</option>
                                            <option value="Resort">Resort</option>
                                            <option value="Budget">Budget Hotel</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Business Logo */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Business Logo</h3>
                                <div className="flex items-center gap-4">
                                    {preview.businessLogo ? (
                                        <div className="relative">
                                            <img
                                                src={preview.businessLogo}
                                                alt="Business Logo Preview"
                                                className="h-24 w-24 rounded-md object-cover border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile('businessLogo')}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                            <span className="text-xs text-gray-500 mt-1">Upload</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange('businessLogo', e)}
                                            />
                                        </label>
                                    )}
                                    <div className="text-sm text-gray-500">
                                        <p>Upload your hotel logo</p>
                                        <p className="text-xs">JPG, PNG, GIF (Max 5MB)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hotel Documents */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">Hotel Documents</h3>
                                    <label className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Add Documents
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={(e) => handleFileChange('hotelDocs', e)}
                                        />
                                    </label>
                                </div>
                                
                                <div className="space-y-2">
                                    {preview.hotelDocs.length > 0 ? (
                                        preview.hotelDocs.map((url, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-gray-500" />
                                                    <span className="text-sm text-gray-700">
                                                        {formData.hotelDocs[index]?.name || `Document ${index + 1}`}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile('hotelDocs', index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No documents uploaded yet</p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">Upload hotel registration, license, and other relevant documents (PDF, DOC, DOCX)</p>
                            </div>

                            {/* Amenities */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Amenities</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm font-medium text-gray-700">Air Conditioning</span>
                                        <div className="flex gap-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.hotelAC === true}
                                                    onChange={(e) => handleInputChange('hotelAC', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    {/* Add more amenities in the same pattern */}
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm font-medium text-gray-700">Parking</span>
                                        <div className="flex gap-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.hotelParking === true}
                                                    onChange={(e) => handleInputChange('hotelParking', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm font-medium text-gray-700">WiFi</span>
                                        <div className="flex gap-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.hoitelWifi === true}
                                                    onChange={(e) => handleInputChange('hoitelWifi', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    {/* Add more amenities as needed */}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : 'Save Hotel Business'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}