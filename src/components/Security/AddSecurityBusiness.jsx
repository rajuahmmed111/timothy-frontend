import React, { useState } from "react";
import { Building2, Upload, X, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { useAddSecurityBusinessMutation } from "../../redux/api/security/securityApi";

export default function AddSecurityBusiness() {
  const [formData, setFormData] = useState({
    securityBusinessName: "",
    securityName: "",
    securityBusinessType: "Private Limited",
    securityRegNum: "",
    securityRegDate: "2025-10-22",
    securityPhone: "",
    securityEmail: "",
    securityTagline: "",
    securityProtocolDescription: "",
    securityProtocolType: "Event Security",
    securityBookingCondition: "",
    securityCancelationPolicy: "",
    hotelAddress: "",
    hotelCity: "",
    hotelPostalCode: "",
    hotelDistrict: "",
    hotelCountry: "",
    hotelLate: "",
    hotelLong: "",
    hotelAccommodationType: "5-Star Luxury",

    businessLogo: null,
    securityDocs: [],
  });

  const [preview, setPreview] = useState({
    businessLogo: null,
    securityDocs: [],
  });

  const [addSecurityBusiness, { isLoading }] = useAddSecurityBusinessMutation();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, e) => {
    const files = Array.from(e.target.files);

    if (field === "businessLogo") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, [field]: file }));
        setPreview((prev) => ({
          ...prev,
          [field]: URL.createObjectURL(file),
        }));
      }
    } else if (field === "securityDocs") {
      setFormData((prev) => ({
        ...prev,
        securityDocs: [...prev.securityDocs, ...files],
      }));
      setPreview((prev) => ({
        ...prev,
        securityDocs: [
          ...prev.securityDocs,
          ...files.map((file) => URL.createObjectURL(file)),
        ],
      }));
    }
  };

  const removeFile = (field, index = null) => {
    if (field === "businessLogo") {
      setFormData((prev) => ({ ...prev, [field]: null }));
      setPreview((prev) => ({ ...prev, [field]: null }));
    } else if (field === "securityDocs" && index !== null) {
      const updatedDocs = [...formData.securityDocs];
      const updatedPreviews = [...preview.securityDocs];
      updatedDocs.splice(index, 1);
      updatedPreviews.splice(index, 1);

      setFormData((prev) => ({ ...prev, securityDocs: updatedDocs }));
      setPreview((prev) => ({ ...prev, securityDocs: updatedPreviews }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Processing...",
      text: "Please wait while we save your security details",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const formDataToSend = new FormData();

      // Fields to send to API (already in security naming)
      const fieldMap = {
        securityBusinessName: "securityBusinessName",
        securityName: "securityName",
        securityBusinessType: "securityBusinessType",
        securityRegNum: "securityRegNum",
        securityRegDate: "securityRegDate",
        securityPhone: "securityPhone",
        securityEmail: "securityEmail",
        securityTagline: "securityTagline",
        securityProtocolDescription: "securityProtocolDescription",
        securityProtocolType: "securityProtocolType",
        securityBookingCondition: "securityBookingCondition",
        securityCancelationPolicy: "securityCancelationPolicy",
        hotelLate: "hotelLate",
        hotelLong: "hotelLong",
        businessLogo: "businessLogo",
        securityDocs: "securityDocs",
      };

      Object.entries(fieldMap).forEach(([srcKey, destKey]) => {
        const value = formData[srcKey];
        if (value === undefined || value === null || value === "") return;
        if (srcKey === "securityDocs" && Array.isArray(value)) {
          value.forEach((file) => formDataToSend.append(destKey, file));
        } else if (value instanceof File) {
          formDataToSend.append(destKey, value);
        } else {
          formDataToSend.append(destKey, value);
        }
      });

      console.log(formDataToSend, "formDataToSend");

      const response = await addSecurityBusiness(formDataToSend).unwrap();

      // ... rest of your success handling code ...
      Swal.close();

      if (response?.success) {
        await Swal.fire({
          title: "Success!",
          text: response.message || "Security protocol created successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#4f46e5",
        });

        // Reset form
        const resetForm = {
          securityBusinessName: "asdf",
          securityName: "asdf",
          securityBusinessType: "Private Limited",
          securityRegNum: "asdf",
          securityRegDate: "2025-10-22",
          securityPhone: "asdf",
          securityEmail: "asdf@asdf.com",
          securityTagline: "asdf",
          securityProtocolDescription: "asdf",
          securityProtocolType: "Event Security",
          securityBookingCondition: "asdf",
          securityCancelationPolicy: "asdf",
          hotelAddress: "",
          hotelCity: "Dubai",
          hotelPostalCode: "00000",
          hotelDistrict: "Al Qudra",
          hotelCountry: "United Arab Emirates",
          hotelLate: "",
          hotelLong: "",
          hotelAccommodationType: "5-Star Luxury",
          businessLogo: null,
          securityDocs: [],
        };

        setFormData(resetForm);
        setPreview({
          businessLogo: null,
          securityDocs: [],
        });

        // Reset file inputs
        document.querySelectorAll('input[type="file"]').forEach((input) => {
          input.value = "";
        });
      }
    } catch (error) {
      Swal.close();

      await Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to add security business",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
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
                <Building2 className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Security Business
                </h2>
              </div>
            </div>

            {/* Main Form */}
            <div className="p-6 space-y-6">
              {/* Business Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.securityBusinessName}
                      onChange={(e) =>
                        handleInputChange("securityBusinessName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Security Business Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.securityName}
                      onChange={(e) =>
                        handleInputChange("securityName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onChange={(e) =>
                        handleInputChange("securityBusinessType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Private Limited">Private Limited</option>
                      <option value="Public Limited">Public Limited</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">
                        Sole Proprietorship
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.securityRegNum}
                      onChange={(e) =>
                        handleInputChange("securityRegNum", e.target.value)
                      }
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
                      value={formData.securityRegDate}
                      onChange={(e) =>
                        handleInputChange("securityRegDate", e.target.value)
                      }
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
                      value={formData.securityPhone}
                      onChange={(e) =>
                        handleInputChange("securityPhone", e.target.value)
                      }
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
                      value={formData.securityEmail}
                      onChange={(e) =>
                        handleInputChange("securityEmail", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contact@royalgrand.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hotelAddress}
                      onChange={(e) =>
                        handleInputChange("hotelAddress", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="14 Buckingham St, London"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hotelCity}
                      onChange={(e) =>
                        handleInputChange("hotelCity", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dubai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hotelPostalCode}
                      onChange={(e) =>
                        handleInputChange("hotelPostalCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="00000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hotelDistrict}
                      onChange={(e) =>
                        handleInputChange("hotelDistrict", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Al Qudra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hotelCountry}
                      onChange={(e) =>
                        handleInputChange("hotelCountry", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="United Arab Emirates"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.securityTagline}
                      onChange={(e) =>
                        handleInputChange("securityTagline", e.target.value)
                      }
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
                      value={formData.securityProtocolDescription}
                      onChange={(e) =>
                        handleInputChange("securityProtocolDescription", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your security business/protocols..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Protocol Type
                    </label>
                    <select
                      value={formData.securityProtocolType}
                      onChange={(e) =>
                        handleInputChange("securityProtocolType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Event Security">Event Security</option>
                      <option value="Executive Protection">Executive Protection</option>
                      <option value="Security Guard">Security Guard</option>
                      <option value="Personal Bodyguard">Personal Bodyguard</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Conditions
                    </label>
                    <textarea
                      rows={2}
                      value={formData.securityBookingCondition}
                      onChange={(e) =>
                        handleInputChange(
                          "securityBookingCondition",
                          e.target.value
                        )
                      }
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
                      value={formData.securityCancelationPolicy}
                      onChange={(e) =>
                        handleInputChange(
                          "securityCancelationPolicy",
                          e.target.value
                        )
                      }
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
                      onChange={(e) =>
                        handleInputChange("hotelLate", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("hotelLong", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange(
                          "hotelAccommodationType",
                          e.target.value
                        )
                      }
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
                <h3 className="text-lg font-medium text-gray-900">
                  Business Logo
                </h3>
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
                        onClick={() => removeFile("businessLogo")}
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
                        onChange={(e) => handleFileChange("businessLogo", e)}
                      />
                    </label>
                  )}
                  <div className="text-sm text-gray-500">
                    <p>Upload your business logo</p>
                    <p className="text-xs">JPG, PNG, GIF (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Security Documents */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Security Documents
                  </h3>
                  <label className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    <Upload className="h-4 w-4 mr-1" />
                    Add Documents
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileChange("securityDocs", e)}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  {preview.securityDocs.length > 0 ? (
                    preview.securityDocs.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {formData.securityDocs[index]?.name ||
                              `Document ${index + 1}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("securityDocs", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No documents uploaded yet
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Upload licenses, protocols, and other relevant documents (PDF, DOC, DOCX)
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Security Business"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
