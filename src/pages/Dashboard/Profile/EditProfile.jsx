import React from "react";
import { useGetMyProfileQuery } from "../../../redux/services/authApi";
import { useUpdateMyProfileMutation } from "../../../redux/api/profileapis";
import Swal from "sweetalert2";
import Loader from "../../../shared/Loader/Loader";

export default function EditProfile() {
  const { data, isLoading } = useGetMyProfileQuery();
  console.log("data of hasan from edit profile", data);
  const [updateMyProfile, { isLoading: isUpdating }] =
    useUpdateMyProfileMutation();

  const profile = data?.data || {};

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const fullName = (formData.get("fullName") || "").trim();
    const contactNumber = (formData.get("contactNumber") || "").trim();
    const country = (formData.get("country") || "").trim();
    const address = (formData.get("address") || "").trim();

    const missing = [];
    if (!fullName) missing.push("Full Name");
    if (!contactNumber) missing.push("Contact Number");
    if (!country) missing.push("Country");
    if (!address) missing.push("Address");

    if (missing.length) {
      Swal.fire({
        icon: "warning",
        title: "Missing required fields",
        html: `Please fill the following field(s): <br/><strong>${missing.join(", ")}</strong>`,
      });
      return;
    }

    const body = {
      fullName,
      contactNumber,
      country,
      address,
    };

    try {
      await updateMyProfile(body).unwrap();
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Profile updated successfully",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.data?.message || "Failed to update profile",
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white px-20 w-[715px] py-16 rounded-md">
      <p className="text-[#0D0D0D] text-center font-bold text-2xl mb-5">
        Edit Your Profile
      </p>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-2 placeholder:text-xl"
            placeholder="Enter full name"
            defaultValue={profile.fullName || ""}
          />
        </div>

        <div>
          <label className="text-xl text-[#0D0D0D] mb-2 font-bold">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-2 placeholder:text-xl bg-gray-100"
            defaultValue={profile.email || ""}
            readOnly
          />
        </div>

        <div>
          <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
            Contact Number
          </label>
          <input
            type="text"
            name="contactNumber"
            className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-2 placeholder:text-xl"
            placeholder="Enter Contact Number"
            defaultValue={profile.contactNumber || ""}
          />
        </div>

        <div>
          <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
            Country
          </label>
          <input
            type="text"
            name="country"
            className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-2 placeholder:text-xl"
            placeholder="Enter Country"
            defaultValue={profile.country || ""}
          />
        </div>

        <div>
          <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
            Address
          </label>
          <input
            type="text"
            name="address"
            className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-2 placeholder:text-xl"
            placeholder="Enter your address"
            defaultValue={profile.address || ""}
          />
        </div>

        <div className="text-center py-5">
          <button
            disabled={isUpdating}
            className="bg-[#0064D2] disabled:opacity-70 text-white font-semibold w-full py-3 rounded-lg"
          >
            {isUpdating ? "Saving..." : "Save & Change"}
          </button>
        </div>
      </form>
    </div>
  );
}
