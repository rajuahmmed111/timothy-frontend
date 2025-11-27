import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useCreateCarMutation,
  useGetCarBusinessPartnerMutation,
} from "../../redux/api/car/carApi";
import Swal from "sweetalert2";

export default function AddNewCar() {
  const navigate = useNavigate();
  const [selectedRental, setSelectedRental] = useState("");
  const [carImages, setCarImages] = useState([]);

  const [getCarRentals, { data: partnerData, isLoading: isPartnerLoading }] =
    useGetCarBusinessPartnerMutation();
  const [createCar, { isLoading: isCreating }] = useCreateCarMutation();

  const carRentals = partnerData?.data?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Load car rentals on mount
  useEffect(() => {
    getCarRentals({ page: 1, limit: 100 });
  }, [getCarRentals]);

  // Auto-select first rental when data loads
  useEffect(() => {
    if (carRentals?.length > 0 && !selectedRental) {
      setSelectedRental(carRentals[0].id);
    }
  }, [carRentals, selectedRental]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => file);
      setCarImages(filesArray);
    }
  };
  const onSubmit = async (data) => {
    if (!selectedRental) {
      toast.error("Please select a car rental");
      return;
    }

    if (carImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      // Create form data
      const formData = new FormData();

      // Prepare car data
      const carData = {
        carAddress: data.carAddress,
        carPostalCode: data.carPostalCode,
        carDistrict: data.carDistrict,
        carCity: data.carCity,
        carCountry: data.carCountry,
        carDescription: data.carDescription,
        carServicesOffered: Array.isArray(data.carServicesOffered)
          ? data.carServicesOffered
          : [data.carServicesOffered].filter(Boolean),
        carType: data.carType,
        carSeats: data.carSeats,
        carOilType: data.carOilType,
        carEngineType: data.carEngineType,
        carTransmission: data.carTransmission,
        carPower: data.carPower,
        carDrivetrain: data.carDrivetrain,
        carMileage: data.carMileage,
        carModel: data.carModel,
        carCapacity: data.carCapacity,
        carColor: data.carColor,
        currency: data.currency,
        fuelType: data.fuelType,
        gearType: data.gearType,
        carRating: data.carRating,
        carPriceDay: Number(data.carPriceDay) || 0,
        category: data.category,
        discount: Number(data.discount) || 0,
        vat: Number(data.vat) || 0,
        carReviewCount: Number(data.carReviewCount) || 0,
        carBookingAbleDays: Array.isArray(data.carBookingAbleDays)
          ? data.carBookingAbleDays
          : [data.carBookingAbleDays].filter(Boolean),
      };

      // Append car data as JSON string
      formData.append("data", JSON.stringify(carData));

      // Append images
      carImages.forEach((image) => {
        formData.append("carImages", image);
      });

      // Send the request
      await createCar({
        formData,
        businessId: selectedRental,
      }).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Car created successfully!",
        confirmButtonText: "OK",
      });

    } catch (error) {
      console.error("Error creating car:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.data?.message || "Failed to create car",
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Car</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Car Rental Selection */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Car Rental Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Car Rental *
              </label>
              <select
                value={selectedRental}
                onChange={(e) => setSelectedRental(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isPartnerLoading}
                required
              >
                {isPartnerLoading ? (
                  <option>Loading rentals...</option>
                ) : carRentals.length > 0 ? (
                  carRentals.map((rental) => (
                    <option key={rental.id} value={rental.id}>
                      {rental?.carBusinessName}
                    </option>
                  ))
                ) : (
                  <option>No car rentals available</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Car Model *
              </label>
              <input
                type="text"
                {...register("carModel", { required: "Car model is required" })}
                className="w-full p-2 border rounded"
                placeholder="Toyota Corolla 2022"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Car Type *
              </label>
              <select
                {...register("carType", { required: "Car type is required" })}
                className="w-full p-2 border rounded"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Seats *
              </label>
              <input
                type="number"
                {...register("carSeats", {
                  required: "Number of seats is required",
                })}
                className="w-full p-2 border rounded"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register("carPriceDay", { required: "Price is required" })}
                className="w-full p-2 border rounded"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency *
              </label>
              <select
                {...register("currency", { required: "Currency is required" })}
                className="w-full p-2 border rounded"
                defaultValue="BDT"
              >
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
                <option value="AED">AED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color *
              </label>
              <input
                type="text"
                {...register("carColor", { required: "Color is required" })}
                className="w-full p-2 border rounded"
                placeholder="Black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <input
                type="text"
                {...register("category", { required: "Category is required" })}
                className="w-full p-2 border rounded"
                placeholder="Premium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount (%)
              </label>
              <input
                type="number"
                {...register("discount")}
                className="w-full p-2 border rounded"
                placeholder="10"
                defaultValue={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <input
                type="text"
                {...register("carRating")}
                className="w-full p-2 border rounded"
                placeholder="4.7"
                defaultValue="4.7"
              />
            </div>
          </div>
        </div>

        {/* Engine & Performance */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Engine & Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fuel Type *
              </label>
              <select
                {...register("fuelType", { required: "Fuel type is required" })}
                className="w-full p-2 border rounded"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gear Type *
              </label>
              <select
                {...register("gearType", { required: "Gear type is required" })}
                className="w-full p-2 border rounded"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transmission *
              </label>
              <select
                {...register("carTransmission", {
                  required: "Transmission is required",
                })}
                className="w-full p-2 border rounded"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Semi-Automatic">Semi-Automatic</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Engine Type
              </label>
              <input
                type="text"
                {...register("carEngineType")}
                className="w-full p-2 border rounded"
                placeholder="V6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Power
              </label>
              <input
                type="text"
                {...register("carPower")}
                className="w-full p-2 border rounded"
                placeholder="220 HP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Drivetrain
              </label>
              <select
                {...register("carDrivetrain")}
                className="w-full p-2 border rounded"
              >
                <option value="FWD">FWD</option>
                <option value="RWD">RWD</option>
                <option value="AWD">AWD</option>
                <option value="4WD">4WD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mileage
              </label>
              <input
                type="text"
                {...register("carMileage")}
                className="w-full p-2 border rounded"
                placeholder="15 km/l"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Oil Type
              </label>
              <input
                type="text"
                {...register("carOilType")}
                className="w-full p-2 border rounded"
                placeholder="Synthetic 5W-30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="text"
                {...register("carCapacity")}
                className="w-full p-2 border rounded"
                placeholder="50L"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Location Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <input
                type="text"
                {...register("carAddress", { required: "Address is required" })}
                className="w-full p-2 border rounded"
                placeholder="123 Main Street"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                {...register("carCity", { required: "City is required" })}
                className="w-full p-2 border rounded"
                placeholder="Dhaka"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                {...register("carDistrict")}
                className="w-full p-2 border rounded"
                placeholder="Dhaka"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                {...register("carPostalCode")}
                className="w-full p-2 border rounded"
                placeholder="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <input
                type="text"
                {...register("carCountry", { required: "Country is required" })}
                className="w-full p-2 border rounded"
                placeholder="Bangladesh"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                {...register("carDescription", {
                  required: "Description is required",
                })}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="A luxury sedan with premium features."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services Offered
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "AC",
                  "WiFi",
                  "GPS",
                  "Child Seat",
                  "Bluetooth",
                  "Sunroof",
                  "USB Charger",
                  "Heated Seats",
                ].map((service) => (
                  <div key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      id={service}
                      value={service}
                      {...register("carServicesOffered")}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label
                      htmlFor={service}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Available Days
              </label>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day) => (
                  <div key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      id={day}
                      value={day}
                      {...register("carBookingAbleDays")}
                      className="h-4 w-4 text-blue-600 rounded"
                      defaultChecked={["Saturday", "Sunday", "Monday"].includes(
                        day
                      )}
                    />
                    <label htmlFor={day} className="ml-2 text-sm text-gray-700">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Car Images */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Car Images *</h2>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload at least one image of the car
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isCreating ? "Creating..." : "Create Car"}
          </button>
        </div>
      </form>
    </div>
  );
}
