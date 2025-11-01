import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAddAttractionBusinessMutation } from '../../redux/api/attraction/attractionApi';

export default function AddAttractionBusiness() {
    const [formData, setFormData] = useState({
        attractionBusinessName: '',
        attractionName: '',
        attractionBusinessType: 'Resort & Waterpark',
        attractionRegNum: '',
        attractionRegDate: '',
        attractionPhone: '',
        attractionEmail: '',
        attractionBusinessTagline: '',
        attractionBusinessDescription: '',
        attractionBookingCondition: '',
        attractionCancelationPolicy: '',
        businessLogo: null,
        attractionDocs: []
    });

    const [preview, setPreview] = useState({
        businessLogo: null,
        attractionDocs: []
    });

    const [addAttractionBusiness, { isLoading }] = useAddAttractionBusinessMutation();
    
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
        } else if (field === 'attractionDocs') {
            setFormData(prev => ({
                ...prev,
                attractionDocs: [...prev.attractionDocs, ...files]
            }));
            setPreview(prev => ({
                ...prev,
                attractionDocs: [
                    ...prev.attractionDocs,
                    ...files.map(file => ({
                        url: URL.createObjectURL(file),
                        name: file.name
                    }))
                ]
            }));
        }
    };

    const removeFile = (field, index = null) => {
        if (field === 'businessLogo') {
            setFormData(prev => ({ ...prev, [field]: null }));
            setPreview(prev => ({ ...prev, [field]: null }));
        } else if (field === 'attractionDocs' && index !== null) {
            const updatedDocs = [...formData.attractionDocs];
            const updatedPreviews = [...preview.attractionDocs];
            updatedDocs.splice(index, 1);
            updatedPreviews.splice(index, 1);
            
            setFormData(prev => ({ ...prev, attractionDocs: updatedDocs }));
            setPreview(prev => ({ ...prev, attractionDocs: updatedPreviews }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const swalInstance = Swal.fire({
            title: 'Processing...',
            text: 'Please wait while we save your attraction business details',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const formDataToSend = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => {
                if (value === null || value === '') return;
                
                if (key === 'attractionDocs') {
                    value.forEach(file => {
                        formDataToSend.append('attractionDocs', file);
                    });
                } else if (value instanceof File) {
                    formDataToSend.append(key, value);
                } else {
                    formDataToSend.append(key, value);
                }
            });

            const response = await addAttractionBusiness(formDataToSend).unwrap();
            
            await swalInstance.close();

            if (response?.success) {
                await Swal.fire({
                    title: 'Success!',
                    text: response.message || 'Attraction business added successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#4f46e5',
                });

                // Reset form
                const resetForm = {
                    attractionBusinessName: '',
                    attractionName: '',
                    attractionBusinessType: 'Resort & Waterpark',
                    attractionRegNum: '',
                    attractionRegDate: '',
                    attractionPhone: '',
                    attractionEmail: '',
                    attractionBusinessTagline: '',
                    attractionBusinessDescription: '',
                    attractionBookingCondition: '',
                    attractionCancelationPolicy: '',
                    businessLogo: null,
                    attractionDocs: []
                };
                
                setFormData(resetForm);
                setPreview({
                    businessLogo: null,
                    attractionDocs: []
                });
                
                document.querySelectorAll('input[type="file"]').forEach(input => {
                    input.value = '';
                });
            }
        } catch (error) {
            await swalInstance.close();
            
            await Swal.fire({
                title: 'Error!',
                text: error?.data?.message || 'Failed to add attraction business',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className=" mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Add New Attraction Business</h1>
                    <p className="text-gray-600">Fill in the details below to register your attraction business</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Business Information */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800">Business Information</h2>
                        
                        {/* Business Logo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Logo
                            </label>
                            <div className="flex items-center gap-4">
                                {preview.businessLogo ? (
                                    <div className="relative">
                                        <img 
                                            src={preview.businessLogo} 
                                            alt="Business Logo" 
                                            className="h-20 w-20 rounded-md object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFile('businessLogo')}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="text-xs text-gray-500 mt-1">Upload Logo</span>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => handleFileChange('businessLogo', e)}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.attractionBusinessName}
                                    onChange={(e) => handleInputChange('attractionBusinessName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter business name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Attraction Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.attractionName}
                                    onChange={(e) => handleInputChange('attractionName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Ocean Paradise Tour"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.attractionBusinessType}
                                    onChange={(e) => handleInputChange('attractionBusinessType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="Resort & Waterpark">Resort & Waterpark</option>
                                    <option value="Amusement Park">Amusement Park</option>
                                    <option value="Adventure Park">Adventure Park</option>
                                    <option value="Museum">Museum</option>
                                    <option value="Zoo">Zoo</option>
                                    <option value="Aquarium">Aquarium</option>
                                    <option value="Historical Site">Historical Site</option>
                                    <option value="Nature Reserve">Nature Reserve</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registration Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.attractionRegNum}
                                    onChange={(e) => handleInputChange('attractionRegNum', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., OPR-2025-055"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registration Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.attractionRegDate}
                                    onChange={(e) => handleInputChange('attractionRegDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.attractionPhone}
                                    onChange={(e) => handleInputChange('attractionPhone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+8801XXXXXXXXX"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.attractionEmail}
                                    onChange={(e) => handleInputChange('attractionEmail', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="contact@example.com"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Tagline
                                </label>
                                <input
                                    type="text"
                                    value={formData.attractionBusinessTagline}
                                    onChange={(e) => handleInputChange('attractionBusinessTagline', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="A short tagline about your attraction"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Business Description */}
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold text-gray-800">Business Description</h2>
                        <p className="text-sm text-gray-500">
                            Provide detailed information about your attraction
                        </p>
                        <textarea
                            value={formData.attractionBusinessDescription}
                            onChange={(e) => handleInputChange('attractionBusinessDescription', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe your attraction in detail..."
                        />
                    </div>

                    {/* Documents */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Business Documents</h2>
                            <p className="text-sm text-gray-500">
                                Upload necessary documents (Registration, License, etc.)
                            </p>
                        </div>
                        
                        {preview.attractionDocs.length > 0 ? (
                            <div className="space-y-2">
                                {preview.attractionDocs.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm text-gray-700">{doc.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile('attractionDocs', index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {preview.attractionDocs.length < 5 && (
                                    <label className="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Add More Files
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            multiple
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange('attractionDocs', e)}
                                        />
                                    </label>
                                )}
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <Upload className="w-10 h-10 text-gray-400" />
                                <p className="text-sm text-gray-500 mt-2">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG, PNG (max 5MB each)</p>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    multiple
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange('attractionDocs', e)}
                                />
                            </label>
                        )}
                    </div>

                    {/* Policies */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800">Policies</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Booking Conditions
                                </label>
                                <textarea
                                    value={formData.attractionBookingCondition}
                                    onChange={(e) => handleInputChange('attractionBookingCondition', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Any special conditions for booking..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cancellation Policy
                                </label>
                                <textarea
                                    value={formData.attractionCancelationPolicy}
                                    onChange={(e) => handleInputChange('attractionCancelationPolicy', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Your cancellation policy..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save Attraction Business'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}