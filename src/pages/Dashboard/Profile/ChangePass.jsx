import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../redux/features/auth/authSlice";
import Swal from "sweetalert2";

function ChangePass() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { changePasswordStatus, changePasswordError } = useSelector((s) => s.auth || {});

  const onSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget; // capture before any await
    const form = new FormData(formElement);
    const currentPassword = form.get("currentPassword");
    const newPassword = form.get("newPassword");
    const confirmPassword = form.get("confirmPassword");

    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({ icon: "warning", title: "Missing fields", text: "Please fill in all fields" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Password mismatch", text: "New password and confirm password do not match" });
      return;
    }

    try {
      await dispatch(
        changePassword({
          oldPassword: currentPassword,
          newPassword,
        })
      ).unwrap();
      Swal.fire({ icon: "success", title: "Success", text: "Password changed successfully" });
      formElement.reset();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: changePasswordError || err || "Failed to change password" });
    }
  };

  return (
    <div className="min-h-screen bg-white px-20 w-[715px] pt-10 py-16 rounded-md">
      <p className="text-primary text-center font-bold text-xl mb-5">Change Password</p>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="w-full">
          <label htmlFor="currentPassword" className="text-xl text-[#0D0D0D] mb-2 font-bold">
            Current Password
          </label>
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              placeholder="**********"
              className="w-full border-2 border-[#6A6D76] rounded-md outline-none px-5 py-3 mt-5 placeholder:text-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="newPassword" className="text-xl text-[#0D0D0D] mb-2 font-bold">
            New Password
          </label>
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="**********"
              className="w-full border-2 border-[#6A6D76] rounded-md outline-none px-5 py-3 mt-5 placeholder:text-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="confirmPassword" className="text-xl text-[#0D0D0D] mb-2 font-bold">
            Confirm New Password
          </label>
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="**********"
              className="w-full border-2 border-[#6A6D76] rounded-md outline-none px-5 py-3 mt-5 placeholder:text-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="text-center py-5">
          <button disabled={changePasswordStatus === 'loading'} className="bg-[#0064D2] text-white font-semibold w-full py-3 rounded-md disabled:opacity-70">
            {changePasswordStatus === 'loading' ? 'Saving...' : 'Save & Change'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePass;