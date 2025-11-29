import React, { useState, useEffect } from "react";
import { Upload, X, FileText } from "lucide-react";
import { useAddCarBusinessMutation } from "../../redux/api/car/addCarBusinessApi";
import Swal from "sweetalert2";
import { countries } from "../../components/country";

export default function AddCarBusiness() {
  const [formData, setFormData] = useState({
    carBusinessName: "",
    carName: "",
    carBusinessType: "",
    carRegNum: "",
    carRegDate: "",
    carRentalType: "",
    carPhone: "",
    carEmail: "",
    carTagline: "",
    carRentalDescription: "",
    carBookingCondition: "",
    carCancelationPolicy: "",
    officeAddress: "",
    officeCity: "",
    officeCountry: "",
    businessLogo: null,
    carDocs: [],
  });

  const [preview, setPreview] = useState({
    businessLogo: null,
    carDocs: [],
  });

  const [addCarBusiness, { isLoading }] = useAddCarBusinessMutation();
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
    } else if (field === "carDocs") {
      setFormData((prev) => ({
        ...prev,
        carDocs: [...prev.carDocs, ...files],
      }));
      setPreview((prev) => ({
        ...prev,
        carDocs: [
          ...prev.carDocs,
          ...files.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
          })),
        ],
      }));
    }
  };

  const removeFile = (field, index = null) => {
    if (field === "businessLogo") {
      setFormData((prev) => ({ ...prev, [field]: null }));
      setPreview((prev) => ({ ...prev, [field]: null }));
    } else if (field === "carDocs" && index !== null) {
      const updatedDocs = [...formData.carDocs];
      const updatedPreviews = [...preview.carDocs];
      updatedDocs.splice(index, 1);
      updatedPreviews.splice(index, 1);

      setFormData((prev) => ({ ...prev, carDocs: updatedDocs }));
      setPreview((prev) => ({ ...prev, carDocs: updatedPreviews }));
    }
  };

  // Auto-detect providers
  const providers = [
    {
      name: "ipapi.co",
      url: "https://ipapi.co/json/",
      parse: (data) => ({ iso: data.country, raw: data }),
    },
    {
      name: "extreme-ip-lookup",
      url: "https://extreme-ip-lookup.com/json/",
      parse: (data) => ({ iso: data.countryCode, raw: data }),
    },
    {
      name: "ipinfo.io",
      url: "https://ipinfo.io/json",
      parse: (data) => ({ iso: data.country, raw: data }),
    },
  ];

  // Auto detect country
  useEffect(() => {
    const detectCountry = async () => {
      for (const provider of providers) {
        try {
          const res = await fetch(provider.url);
          if (!res.ok) continue;

          const json = await res.json();
          const { iso } = provider.parse(json);

          if (iso) {
            setFormData((prev) => ({ ...prev, officeCountry: iso }));
            break;
          }
        } catch { }
      }
    };
    detectCountry();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const swalInstance = Swal.fire({
      title: "Processing...",
      text: "Please wait while we save your car business details",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === "") return;

        if (key === "carDocs") {
          value.forEach((file) => {
            formDataToSend.append("carDocs", file);
          });
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value);
        }
      });

      const response = await addCarBusiness(formDataToSend).unwrap();

      await swalInstance.close();

      if (response?.success) {
        await Swal.fire({
          title: "Success!",
          text: response.message || "Car business added successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#4f46e5",
        });

        // Reset form
        const resetForm = {
          carBusinessName: "",
          carName: "",
          carBusinessType: "",
          carRegNum: "",
          carRegDate: "",
          carRentalType: "",
          carPhone: "",
          carEmail: "",
          carTagline: "",
          carRentalDescription: "",
          carBookingCondition: "",
          carCancelationPolicy: "",
          officeAddress: "",
          officeCity: "",
          officeCountry: "",
          businessLogo: null,
          carDocs: [],
        };

        setFormData(resetForm);
        setPreview({
          businessLogo: null,
          carDocs: [],
        });

        document.querySelectorAll('input[type="file"]').forEach((input) => {
          input.value = "";
        });
      }
    } catch (error) {
      await swalInstance.close();

      await Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to add car business",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className=" mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Add New Car Business
          </h1>
          <p className="text-gray-600">
            Fill in the details below to register your car rental business
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Business Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Business Information
            </h2>

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
                      onClick={() => removeFile("businessLogo")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">
                      Upload Logo
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange("businessLogo", e)}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.carBusinessName}
                  onChange={(e) =>
                    handleInputChange("carBusinessName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Name/Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.carName}
                  onChange={(e) => handleInputChange("carName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Toyota Premio"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.carBusinessType}
                  onChange={(e) =>
                    handleInputChange("carBusinessType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Private">Private</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Rental Service">Rental Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.carRegNum}
                  onChange={(e) =>
                    handleInputChange("carRegNum", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., DHK-123456"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.carRegDate}
                  onChange={(e) =>
                    handleInputChange("carRegDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Rental Type
                </label>
                <select
                  value={formData.carRentalType}
                  onChange={(e) =>
                    handleInputChange("carRentalType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="default">Car Rental Type</option>
                  <option value="daily">Daily Rentals</option>
                  <option value="weekly">Weekly Rentals</option>
                  <option value="monthly">Monthly Rentals</option>
                  <option value="long-term">Long-Term Leasing</option>
                  <option value="self-drive">Self-Drive Rentals</option>
                  <option value="chauffeur">Chauffeur-Driven Rentals</option>
                  <option value="luxury">Luxury Car Rentals</option>
                  <option value="sports">Sports Car Rentals</option>
                  <option value="suv_rentals">SUV Rentals</option>
                  <option value="ev">Electric Vehicle (EV) Rentals</option>
                  <option value="airport">Airport Pickup and Dropoff</option>
                  <option value="corporate">Corporate Rentals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.carPhone}
                  onChange={(e) =>
                    handleInputChange("carPhone", e.target.value)
                  }
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
                  value={formData.carEmail}
                  onChange={(e) =>
                    handleInputChange("carEmail", e.target.value)
                  }
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
                  value={formData.carTagline}
                  onChange={(e) =>
                    handleInputChange("carTagline", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="A short tagline about your business"
                />
              </div>
            </div>
          </div>

          {/* Business Description */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Business Description
            </h2>
            <p className="text-sm text-gray-500">
              Provide detailed information about your car rental services
            </p>
            <textarea
              value={formData.carRentalDescription}
              onChange={(e) =>
                handleInputChange("carRentalDescription", e.target.value)
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your car rental service..."
            />
          </div>

          {/* Office Address */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Office Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.officeAddress}
                  onChange={(e) =>
                    handleInputChange("officeAddress", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full office address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.officeCity}
                  onChange={(e) =>
                    handleInputChange("officeCity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.officeCountry}
                  onChange={(e) =>
                    handleInputChange("officeCountry", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Car Documents
              </h2>
              <p className="text-sm text-gray-500">
                Upload necessary documents (Registration, Insurance, etc.)
              </p>
            </div>

            {preview.carDocs.length > 0 ? (
              <div className="space-y-2">
                {preview.carDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{doc.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("carDocs", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {preview.carDocs.length < 5 && (
                  <label className="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Add More Files
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("carDocs", e)}
                    />
                  </label>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, DOC, JPG, PNG (max 5MB each)
                </p>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange("carDocs", e)}
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
                  value={formData.carBookingCondition}
                  onChange={(e) =>
                    handleInputChange("carBookingCondition", e.target.value)
                  }
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
                  value={formData.carCancelationPolicy}
                  onChange={(e) =>
                    handleInputChange("carCancelationPolicy", e.target.value)
                  }
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
              {isLoading ? "Saving..." : "Save Car Business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
