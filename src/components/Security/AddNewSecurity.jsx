import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import Swal from "sweetalert2";
import {
  useAddSecurityGuardMutation,
  useGetSecurityPartnerQuery,
} from "../../redux/api/security/securityApi";

export default function AddNewSecurity() {
  const [loading, setLoading] = useState(false);
  const [securityImages, setSecurityImages] = useState([]);
  const [selectedSecurityId, setSelectedSecurityId] = useState("");
  const [selectedSecurityType, setSelectedSecurityType] = useState("");
  const [addSecurityGuard] = useAddSecurityGuardMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      securityGuardName: "aman-create-security-1",
      securityAddress: "Dhaka",
      securityPostalCode: "1207",
      securityDistrict: "Dhaka",
      securityCity: "Dhaka",
      securityCountry: "Bangladesh",
      securityGuardDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      experience: 5,
      availability: "24/7",
      languages: "English",
      securityServicesOffered: "Patrolling",
      certification: "CSP",
      securityRating: "5",
      currency: "BDT",
    },
  });

  const { data: securityData, isLoading: isPartnerLoading } =
    useGetSecurityPartnerQuery({ limit: 1000, page: 1 });

  // Currency rates state
  const [rates, setRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState("");

  // Removed getPartner effect; data now comes from useGetAllSecurityProtocolsQuery

  // currency rates
  useEffect(() => {
    let active = true;
    const fetchRates = async () => {
      try {
        setRatesLoading(true);
        setRatesError("");
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("Failed to load currency rates");
        const json = await res.json();
        // Expect json.rates to be an object of { code: rate }
        if (active) setRates(json?.rates || null);
      } catch (e) {
        if (active) setRatesError("Unable to load currency list");
      } finally {
        if (active) setRatesLoading(false);
      }
    };
    fetchRates();
    return () => {
      active = false;
    };
  }, []);

  const securityListings = securityData?.data?.data || [];
  useEffect(() => {
    if (!selectedSecurityId && securityListings.length > 0) {
      const first = securityListings[0];
      setSelectedSecurityId(first.id);
      setSelectedSecurityType(
        first?.securityBusinessType || first?.securityProtocolType || ""
      );
    }
  }, [securityListings, selectedSecurityId]);

  const selectedSecurity = securityListings.find(
    (s) => s.id === selectedSecurityId
  );

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSecurityImages([...securityImages, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...securityImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setSecurityImages(newImages);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (!selectedSecurityId) {
        await Swal.fire({
          icon: "warning",
          title: "Security types not loaded",
          text: "Please wait for your security types to load.",
        });
        return;
      }
      if (!securityImages.length) {
        await Swal.fire({
          icon: "warning",
          title: "No images",
          text: "Please upload at least one security image.",
        });
        return;
      }

      const formData = new FormData();

      const numericKeys = [
        "securityPriceDay",
        "experience",
        "discount",
        "securityReviewCount",
      ];

      const arrayFields = {
        languages: (data.languages || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        securityServicesOffered: (data.securityServicesOffered || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const payload = {
        securityGuardName: data.securityGuardName,
        securityAddress: data.securityAddress,
        securityPostalCode: data.securityPostalCode,
        securityDistrict: data.securityDistrict,
        securityCity: data.securityCity,
        securityCountry: data.securityCountry,
        securityGuardDescription: data.securityGuardDescription,
        experience: data.experience,
        availability: data.availability,
        certification: data.certification,
        securityRating: data.securityRating,
        securityPriceDay: data.securityPriceDay,
        category: data.category,
        discount: data.discount,
        currency: data.currency || "BDT",
        securityReviewCount: data.securityReviewCount,
      };

      Object.entries(payload).forEach(([key, value]) => {
        const normalized = numericKeys.includes(key) ? Number(value) : value;
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, normalized);
        }
      });

      arrayFields.languages.forEach((lang) =>
        formData.append("languages", lang)
      );
      arrayFields.securityServicesOffered.forEach((svc) =>
        formData.append("securityServicesOffered", svc)
      );

      securityImages.forEach((image) => {
        formData.append("securityImages", image.file);
      });

      Swal.fire({
        title: "Creating Security",
        text: "Please wait while we create your security guard...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await addSecurityGuard({
        formData,
        Id: selectedSecurityId,
      }).unwrap();
      Swal.close();
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.message || "Security guard created successfully!",
        confirmButtonText: "View Security",
      });

      navigate("/dashboard/security-management");
    } catch (error) {
      console.error("Error creating security guard:", error);
      Swal.close();
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.data?.message ||
          "Failed to create security guard. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onError = (formErrors) => {
    const firstErrKey =
      (formErrors && Object.keys(formErrors)[0]) || "securityGuardDescription";
    const err = formErrors[firstErrKey];
    Swal.fire({
      icon: "warning",
      title: "Validation error",
      text: err?.message || "Please fill the required fields.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Security Guard</h1>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Select Security type */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Select Security Type</h2>
          {securityListings?.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Security Type
              </label>
              <select
                value={selectedSecurityId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedSecurityId(val);
                  const found = securityListings.find((x) => x.id === val);
                  setSelectedSecurityType(
                    found?.securityBusinessType ||
                      found?.securityProtocolType ||
                      ""
                  );
                }}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none"
                disabled={isPartnerLoading}
              >
                {securityListings.map((h) => {
                  const label = h.securityBusinessName;
                  return (
                    <option key={h.id} value={h.id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            <p className="text-gray-600">No security found for your account.</p>
          )}
        </div>
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Security Guard Name
              </label>
              <input
                type="text"
                {...register("securityGuardName", {
                  required: "Name is required",
                })}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
              {errors.securityGuardName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.securityGuardName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price per Day ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("securityPriceDay", {
                  required: "Price is required",
                  min: { value: 0, message: "Price cannot be negative" },
                })}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
              {errors.securityPriceDay && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.securityPriceDay.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                {...register("currency")}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              >
                {rates ? (
                  Object.keys(rates)
                    .sort()
                    .map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))
                ) : (
                  <>
                    <option value="BDT">BDT</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="NGN">NGN</option>
                    <option value="AED">AED</option>
                  </>
                )}
              </select>
              {/* Show current rate for selected currency relative to USD */}
              {(() => {
                const selected = watch("currency") || "BDT";
                const rate = rates?.[selected];
                if (ratesLoading)
                  return (
                    <p className="text-xs text-gray-500 mt-1">Loading rates…</p>
                  );
                if (ratesError)
                  return (
                    <p className="text-xs text-amber-600 mt-1">{ratesError}</p>
                  );
                return rate ? (
                  <p className="text-xs text-gray-500 mt-1">
                    1 USD ≈ {rate} {selected}
                  </p>
                ) : null;
              })()}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience (years)
              </label>
              <input
                type="number"
                min="0"
                {...register("experience")}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <input
                type="text"
                {...register("availability")}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("securityGuardDescription", {
                required: "Description is required",
              })}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>
        {/* Location Section */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                {...register("securityAddress", {
                  required: "Address is required",
                })}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
              {errors.securityAddress && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.securityAddress.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                {...register("securityCity", { required: "City is required" })}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
              {errors.securityCity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.securityCity.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                {...register("securityPostalCode", {
                  required: "Postal code is required",
                })}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
              {errors.securityPostalCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.securityPostalCode.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                {...register("securityCountry", {
                  required: "Country is required",
                })}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
              {errors.securityCountry && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.securityCountry.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                {...register("securityDistrict")}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Security Images</h2>
          <div className="mt-2 flex flex-wrap gap-4">
            {securityImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Upload Image</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Guard Details */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Guard Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. English, Bangla, Hindi"
                {...register("languages")}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Services Offered (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Patrolling, CCTV Monitoring"
                {...register("securityServicesOffered")}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Certification
              </label>
              <input
                type="text"
                placeholder="e.g. CSP, Fire Safety Training"
                {...register("certification", {
                  required: "Certification is required",
                })}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
              {errors.certification && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.certification.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <select
                {...register("securityRating")}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              >
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                  <option key={rating} value={rating.toString()}>
                    {rating} {rating === 1 ? "star" : "stars"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Security"}
          </button>
        </div>
      </form>
    </div>
  );
}
