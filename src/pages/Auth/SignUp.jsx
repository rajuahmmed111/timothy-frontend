import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterUserMutation } from "../../redux/services/authApi";

export default function SignUp() {
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API expects role default USER; allow BUSINESS_PARTNER choice
      const body = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role || "USER",
        country: form.country,
      };
      await registerUser(body).unwrap();
      // After sign up, navigate to login
      navigate("/logIn");
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5 my-10">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_30px_rgba(0,0,0,0.1)] rounded-2xl">
            <h2 className="text-[#0D0D0D] text-2xl font-bold text-center mb-5">
              Create your account
            </h2>
            <p className="text-[#6A6D76] text-center mb-10">
              Fill in the details to sign up.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Mehedi Hasan"
                  className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                  required
                />
              </div>

              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="enter your gmail"
                  className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                  required
                />
              </div>

              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="**********"
                  className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                  required
                />
              </div>

              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5"
                >
                  <option value="USER">USER</option>
                  <option value="BUSINESS_PARTNER">BUSINESS_PARTNER</option>
                </select>
                <p className="text-sm text-[#6A6D76] mt-2">
                  Default is USER. Select BUSINESS_PARTNER if applicable.
                </p>
              </div>

              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="e.g. Bangladesh"
                  className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                  required
                />
              </div>

              <div className="flex justify-center items-center gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/3 bg-[#0064D2] text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5 disabled:opacity-60"
                >
                  {isLoading ? "Creating..." : "Create account"}
                </button>
                <Link
                  to="/logIn"
                  className="w-1/3 text-center border border-[#0064D2] text-[#0064D2] font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5"
                >
                  Log in
                </Link>
              </div>
              {error ? (
                <p className="text-red-500 text-center mt-4 text-sm">
                  {error?.data?.message || "Registration failed"}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
