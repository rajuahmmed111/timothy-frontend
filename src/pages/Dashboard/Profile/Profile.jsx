import React from "react";
import { useState } from "react";
import { Camera } from "lucide-react";
import EditProfile from "./EditProfile";
import ChangePass from "./ChangePass";
import { useGetMyProfileQuery } from "../../../redux/services/authApi";
import { useUploadProfileImageMutation } from "../../../redux/api/profileapis";
import Loader from "../../../shared/Loader/Loader";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("editProfile");
  const { data } = useGetMyProfileQuery();
  const [uploadProfileImage, { isLoading }] = useUploadProfileImageMutation();

  const profile = data?.data || {};

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadProfileImage(file).unwrap();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to upload image");
    } finally {
      e.target.value = "";
    }
  };

  const editTabClass =
    "cursor-pointer pb-1 " +
    (activeTab === "editProfile"
      ? "text-[#0064D2] border-b-2 border-[#0064D2]"
      : "text-[#0064D2]");

  const changeTabClass =
    "cursor-pointer pb-1 " +
    (activeTab === "changePassword"
      ? "text-[#0064D2] border-b-2 border-[#0064D2]"
      : "text-[#0064D2]");

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="overflow-y-auto">
      <div className="px-5 pb-5 h-full">
        <h3 className="font-bold pb-5 text-xl text-[#242424]">
          Profile Section
        </h3>
        <div className="mx-auto flex flex-col justify-center items-center">
          {/* Profile Picture Section */}
          <div className="flex justify-center items-center bg-[#0064D2] mt-5 text-white w-[900px] mx-auto p-5 gap-5 rounded-lg">
            <div className="relative">
              <div className="w-[122px] h-[122px] bg-gray-300 rounded-full border-4 border-white shadow-xl flex justify-center items-center">
                <img
                  src={
                    profile.profileImage ||
                    "https://avatar.iran.liara.run/public/44"
                  }
                  alt="profile"
                  className="h-30 w-32 rounded-full object-cover"
                />
                {/* Upload Icon */}
                <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <label htmlFor="profilePicUpload" className="cursor-pointer">
                    <Camera className="text-[#575757]" size={16} />
                  </label>
                  <input
                    type="file"
                    id="profilePicUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xl md:text-3xl font-bold">
                {profile.fullName || "User"}
              </p>
              <p className="text-xl font-semibold">{profile.role || "User"}</p>
            </div>
          </div>

          {/* Tab Navigation Section */}
          <div className="flex justify-center items-center gap-5 text-md md:text-xl font-semibold my-5">
            <p
              onClick={() => setActiveTab("editProfile")}
              className={editTabClass}
            >
              Edit Profile
            </p>
            <p
              onClick={() => setActiveTab("changePassword")}
              className={changeTabClass}
            >
              Change Password
            </p>
          </div>

          {/* Tab Content Section */}
          <div className="flex justify-center items-center p-5 rounded-md">
            <div className="w-full max-w-3xl">
              {activeTab === "editProfile" && <EditProfile />}
              {activeTab === "changePassword" && <ChangePass />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
