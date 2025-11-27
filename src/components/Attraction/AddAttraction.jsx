import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  useCreateAttractionAppealMutation,
  useGetPartenrsAllAttractionQuery,
} from "../../redux/api/attraction/attractionApi";
import { currencyByCountry } from "../curenci";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// function to generate time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour += 2) {
    const from = `${hour.toString().padStart(2, "0")}:00`;
    const to = `${(hour + 2).toString().padStart(2, "0")}:00`;
    slots.push({ from, to });
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const AddAttraction = () => {
  const [selectedSlots, setSelectedSlots] = useState({});
  const [attractionImages, setAttractionImages] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [form, setForm] = useState({
    attractionDestinationType: "Art Gallery",
    category: "Cultural",
    description: "",
    address: "",
    city: "",
    postalCode: "",
    district: "",
    country: "",
    adultPrice: "",
    childPrice: "",
    discount: "",
    vat: "",
    currency: "BDT",
    freeWifi: false,
    freeParking: false,
    kitchen: false,
    tv: false,
    airConditioning: false,
    pool: false,
  });

  const [createAttractionAppeal, { isLoading }] =
    useCreateAttractionAppealMutation();

  const { data: attractionsData, isLoading: isAttractionsLoading } =
    useGetPartenrsAllAttractionQuery();

  const attractions =
    attractionsData?.data?.data ??
    attractionsData?.data ??
    attractionsData ??
    [];

  useEffect(() => {
    if (!selectedBusinessId && Array.isArray(attractions) && attractions.length) {
      const first = attractions[0];
      const id = first?.id || first?._id || first?.attractionBusinessId;
      if (id) setSelectedBusinessId(id);
    }
  }, [attractions]);

  const toggleSlot = (day, slot) => {
    setSelectedSlots((prev) => {
      const existing = prev[day] || [];
      const exists = existing.some((s) => s.from === slot.from);
      return {
        ...prev,
        [day]: exists
          ? existing.filter((s) => s.from !== slot.from)
          : [...existing, slot],
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttractionImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBusinessId) {
      return Swal.fire("Error", "Select an attraction business.", "error");
    }

    if (attractionImages.length === 0) {
      return Swal.fire("Error", "Please select at least one image.", "error");
    }

    const dataPayload = {
      attractionDestinationType: form.attractionDestinationType,
      attractionDescription: form.description,
      attractionAddress: form.address,
      attractionCity: form.city,
      attractionPostalCode: form.postalCode,
      attractionDistrict: form.district,
      attractionCountry: form.country,
      attractionFreeWifi: !!form.freeWifi,
      attractionFreeParking: !!form.freeParking,
      attractionKitchen: !!form.kitchen,
      attractionTv: !!form.tv,
      attractionAirConditioning: !!form.airConditioning,
      attractionPool: !!form.pool,
      attractionServicesOffered: [
        "Guided Tours",
        "Art Workshops",
        "Gift Shop",
        "Café",
      ],
      attractionRating: "4.9",
      attractionAdultPrice: Number(form.adultPrice),
      attractionChildPrice: Number(form.childPrice),
      category: form.category,
      discount: Number(form.discount),
      currency: form.currency,
      vat: Number(form.vat),
      attractionReviewCount: 85,
      schedules: Object.keys(selectedSlots).map((day) => ({
        day,
        slots: selectedSlots[day],
      })),
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(dataPayload));
    attractionImages.forEach((file) => formData.append("attractionImages", file));

    try {
      await createAttractionAppeal({
        attractionBusinessId: selectedBusinessId,
        data: formData,
      }).unwrap();
      Swal.fire("Success", "Attraction created successfully.", "success");
    } catch (err) {
      Swal.fire("Error", err?.data?.message || "Failed to create.", "error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 p-6 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-8 mt-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Add Attraction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Business */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Select Attraction Business
              </label>
              <select
                value={selectedBusinessId}
                disabled={isAttractionsLoading}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                {isAttractionsLoading ? (
                  <option>Loading...</option>
                ) : attractions.length ? (
                  attractions.map((item) => {
                    const id =
                      item?.id || item?._id || item?.attractionBusinessId;
                    const name =
                      item?.attractionBusinessName ||
                      item?.businessName ||
                      item?.name ||
                      id;
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })
                ) : (
                  <option>No attraction found</option>
                )}
              </select>
            </div>

            {/* Images */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Attraction Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Attraction Destination Type
              </label>
              <select
                value={form.attractionDestinationType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, attractionDestinationType: e.target.value }))
                }
                className="p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option>Art Gallery</option>
                <option>Museum</option>
                <option>Theme Park</option>
                <option>Historical Place</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option>Cultural</option>
                <option>Adventure</option>
                <option>Entertainment</option>
                <option>Relaxation</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Attraction Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Address fields */}
            {[
              { key: "address", label: "Address" },
              { key: "city", label: "City" },
              { key: "postalCode", label: "Postal Code" },
              { key: "district", label: "District" },
              { key: "country", label: "Country" },
            ].map((f) => (
              <div key={f.key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input
                  className="p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                  value={form[f.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}

            {/* Features */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-2">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: "freeWifi", label: "Free Wifi" },
                  { key: "freeParking", label: "Free Parking" },
                  { key: "kitchen", label: "Kitchen" },
                  { key: "tv", label: "TV" },
                  { key: "airConditioning", label: "Air Conditioning" },
                  { key: "pool", label: "Pool" },
                ].map((f) => (
                  <label key={f.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Prices */}
            {[
              { key: "adultPrice", label: "Adult Price" },
              { key: "childPrice", label: "Child Price" },
              { key: "discount", label: "Discount (%)" },
              { key: "vat", label: "VAT (%)" },
            ].map((f) => (
              <div key={f.key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input
                  type="number"
                  value={form[f.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            ))}

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                className="p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                {Array.from(new Set(Object.values(currencyByCountry).map((c) => c.code))).map(
                  (code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* ─────────────────────────────
                  SCHEDULE SECTION
          ───────────────────────────── */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Schedules (2-hour Multi Select)
            </h2>

            <div className="space-y-6">
              {days.map((day) => (
                <div key={day} className="bg-white/70 border rounded-xl p-4 shadow">
                  <h3 className="text-lg font-semibold mb-3">{day}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlots[day]?.some((s) => s.from === slot.from);
                      return (
                        <button
                          key={slot.from}
                          type="button"
                          onClick={() => toggleSlot(day, slot)}
                          className={`px-4 py-2 rounded-full transition ${
                            isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {slot.from} - {slot.to}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="w-full flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddAttraction;
