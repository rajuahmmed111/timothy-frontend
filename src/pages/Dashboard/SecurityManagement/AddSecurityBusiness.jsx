import React, { useState } from 'react';
import { Building2, Shield, Calendar, Phone, Mail, Tag, FileText, CreditCard, X } from 'lucide-react';
import { useAddSecurityBusinessMutation } from '../../../redux/api/security/addSecurityBusinessApi';
import Swal from 'sweetalert2';

export default function AddSecurityBusiness() {
  const [formData, setFormData] = useState({
    securityBusinessName: '',
    securityName: '',
    securityBusinessType: '',
    securityRegNum: '',
    securityRegDate: '',
    securityPhone: '',
    securityEmail: '',
    securityTagline: '',
    securityProtocolDescription: '',
    securityProtocolType: '',
    securityBookingCondition: '',
    securityCancelationPolicy: '',
    securityDocs: null,
    businessLogo: null
  });

  const [preview, setPreview] = useState({
    securityDocs: null,
    businessLogo: null
  });

  const [addSecurityBusiness, { isLoading }] = useAddSecurityBusinessMutation();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      // Create preview URL
      setPreview(prev => ({
        ...prev,
        [field]: URL.createObjectURL(file)
      }));
    }
  };

  const removeFile = (field) => {
    setFormData(prev => ({ ...prev, [field]: null }));
    setPreview(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show loading state
    const swalInstance = Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we save your security business details',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const formDataToSend = new FormData();
      
      // Append all form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          // If it's a File object, append it directly
          if (value instanceof File) {
            formDataToSend.append(key, value);
          } else {
            // Convert other values to string
            formDataToSend.append(key, String(value));
          }
        }
      });

      const response = await addSecurityBusiness(formDataToSend).unwrap();
      
      // Close loading state
      await swalInstance.close();

      if (response?.success) {
        // Show success message
        await Swal.fire({
          title: 'Success!',
          text: response.message || 'Security business added successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#4f46e5',
        });

        // Reset form
        const resetForm = {
          securityBusinessName: '',
          securityName: '',
          securityBusinessType: '',
          securityRegNum: '',
          securityRegDate: '',
          securityPhone: '',
          securityEmail: '',
          securityTagline: '',
          securityProtocolDescription: '',
          securityProtocolType: '',
          securityBookingCondition: '',
          securityCancelationPolicy: '',
          securityDocs: null,
          businessLogo: null
        };
        
        setFormData(resetForm);
        setPreview({
          securityDocs: null,
          businessLogo: null
        });
        
        // Reset file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
          input.value = '';
        });
      } else {
        throw new Error(response?.message || 'Failed to add security business');
      }
    } catch (error) {
      // Close loading state
      await swalInstance.close();
      
      // Show error message
      await Swal.fire({
        title: 'Error!',
        text: error?.data?.message || error.message || 'Failed to add security business',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className=" mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
            {/* Header */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Add Security Business</h2>
              </div>
            </div>

            {/* Main Form */}
            <div className="p-6 space-y-6">
              {/* Business Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.securityBusinessName}
                        onChange={(e) => handleInputChange('securityBusinessName', e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                        placeholder="Guard Protection Services"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.securityName}
                      onChange={(e) => handleInputChange('securityName', e.target.value)}
                      className="block w-full rounded-md pl-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                      placeholder="IronGuard Elite"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.securityBusinessType}
                      onChange={(e) => handleInputChange('securityBusinessType', e.target.value)}
                      className="block w-full rounded-md pl-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                    >
                      <option value="">Select business type</option>
                      <option value="Event Security">Event Security</option>
                      <option value="Residential Security">Residential Security</option>
                      <option value="Corporate Security">Corporate Security</option>
                      <option value="Personal Security">Personal Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.securityRegNum}
                      onChange={(e) => handleInputChange('securityRegNum', e.target.value)}
                      className="block w-full rounded-md pl-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                      placeholder="SEC-2025-004"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={formData.securityRegDate}
                        onChange={(e) => handleInputChange('securityRegDate', e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={formData.securityPhone}
                        onChange={(e) => handleInputChange('securityPhone', e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                        placeholder="+8801777666555"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.securityEmail}
                        onChange={(e) => handleInputChange('securityEmail', e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                        placeholder="events@ironguard.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.securityTagline}
                        onChange={(e) => handleInputChange('securityTagline', e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                        placeholder="Strong Protection for Every Occasion"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Protocol Information */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Protocol Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Protocol Type
                    </label>
                    <select
                      value={formData.securityProtocolType}
                      onChange={(e) => handleInputChange('securityProtocolType', e.target.value)}
                      className="block pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                    >
                      <option value="">Select protocol type</option>
                      <option value="Event Security">Event Security</option>
                      <option value="VIP Protection">VIP Protection</option>
                      <option value="Crowd Control">Crowd Control</option>
                      <option value="Surveillance">Surveillance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Protocol Description
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        rows={4}
                        value={formData.securityProtocolDescription}
                        onChange={(e) => handleInputChange('securityProtocolDescription', e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                        placeholder="Describe the security protocols and procedures..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Terms & Conditions</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Conditions
                    </label>
                    <textarea
                      rows={2}
                      value={formData.securityBookingCondition}
                      onChange={(e) => handleInputChange('securityBookingCondition', e.target.value)}
                      className="block pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                      placeholder="Booking must be confirmed 7 days before the event with 50% advance payment."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cancellation Policy
                    </label>
                    <textarea
                      rows={3}
                      value={formData.securityCancelationPolicy}
                      onChange={(e) => handleInputChange('securityCancelationPolicy', e.target.value)}
                      className="block pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter cancellation policy..."
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Logo
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className="relative">
                        {preview.businessLogo ? (
                          <div className="relative">
                            <img
                              src={preview.businessLogo}
                              alt="Business Logo Preview"
                              className="h-24 w-24 rounded-md object-cover"
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
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <div className="space-y-1">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="business-logo-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="business-logo-upload"
                                    name="business-logo-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange('businessLogo', e)}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security Documents (PDF, DOCX, JPG, PNG)
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className="relative">
                        {preview.securityDocs ? (
                          <div className="relative">
                            <div className="flex items-center p-2 bg-gray-100 rounded-md">
                              <FileText className="h-8 w-8 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700 truncate">
                                {formData.securityDocs.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile('securityDocs')}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <div className="space-y-1">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="security-docs-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="security-docs-upload"
                                    name="security-docs-upload"
                                    type="file"
                                    className="sr-only"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange('securityDocs', e)}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PDF, DOCX, JPG, PNG up to 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Security Business'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}