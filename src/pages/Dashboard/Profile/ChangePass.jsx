import React from "react"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function ChangePass() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white px-20 w-[715px] pt-10 py-16 rounded-md">
      <p className="text-primary text-center font-bold text-xl mb-5">
        Change Password
      </p>
      <form className="space-y-4">
        <div className="w-full">
          <label
            htmlFor="password"
            className="text-xl text-[#0D0D0D] mb-2 font-bold"
          >
            Current Password
          </label>
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="**********"
              className="w-full border-2 border-[#6A6D76] rounded-md outline-none px-5 py-3 mt-5 placeholder:text-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="password"
            className="text-xl text-[#0D0D0D] mb-2 font-bold"
          >
            New Password
          </label>
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="**********"
              className="w-full border-2 border-[#6A6D76] rounded-md outline-none px-5 py-3 mt-5 placeholder:text-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="password"
            className="text-xl text-[#0D0D0D] mb-2 font-bold"
          >
            Confirm New Password
          </label>
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="**********"
              className="w-full border-2 border-[#6A6D76] rounded-md outline-none px-5 py-3 mt-5 placeholder:text-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className="text-center py-5">
          <button className="bg-[#0064D2] text-white font-semibold w-full py-3 rounded-md">
            Save & Change
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePass;