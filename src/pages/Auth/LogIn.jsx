import React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";

export default function LogIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading, error } ] = useLoginMutation();

    useEffect(() => {
        // Prefill saved credentials if user opted for Remember Password previously
        try {
            const raw = localStorage.getItem('rememberCredentials');
            if (raw) {
                const saved = JSON.parse(raw);
                if (saved?.email) setEmail(saved.email);
                if (saved?.password) setPassword(saved.password);
                setIsChecked(true);
            }
        } catch {
            // ignore malformed storage
        }
    }, []);

    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        if (!checked) {
            // If user toggles off, clear saved credentials immediately
            localStorage.removeItem('rememberCredentials');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            // Expected response shape per spec
            const { accessToken, refreshToken, user } = res?.data || {};
            dispatch(setCredentials({ accessToken, refreshToken, user }));
            // Save or clear remembered credentials based on checkbox
            if (isChecked) {
                localStorage.setItem('rememberCredentials', JSON.stringify({ email, password }));
            } else {
                localStorage.removeItem('rememberCredentials');
            }
            navigate("/");
        } catch (err) {
            console.error("Login failed", err);
            // Optional: show toast here
        }
    };

    return (
        <div className="bg-white min-h-screen flex items-center justify-center p-5">
            <div className="container mx-auto">
                <div className="flex  justify-center items-center">
                    <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_30px_rgba(0,0,0,0.1)] rounded-2xl">
                        <h2 className="text-[#0D0D0D] text-2xl  font-bold text-center mb-5">
                            Log in to your account
                        </h2>
                        <p className="text-[#6A6D76] text-center mb-10">
                            Please enter your email and password to continue.
                        </p>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="w-full">
                                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="enter your gmail"
                                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                                    Password
                                </label>
                                <div className="w-full relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            <div className="flex justify-between items-center text-sm my-5">
                                <label className="flex items-center gap-[10px] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        onChange={handleCheckboxChange}
                                    />
                                    {isChecked ? (
                                        <svg
                                            width="21"
                                            height="21"
                                            viewBox="0 0 21 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g id="Group 335">
                                                <rect
                                                    id="Rectangle 331"
                                                    x="-0.00012207"
                                                    y="6.10352e-05"
                                                    width="21"
                                                    height="21"
                                                    rx="4"
                                                    className="fill-[#00B047]"
                                                    stroke="#00B047"
                                                ></rect>
                                                <path
                                                    id="Vector"
                                                    d="M8.19594 15.4948C8.0646 15.4949 7.93453 15.4681 7.81319 15.4157C7.69186 15.3633 7.58167 15.2865 7.48894 15.1896L4.28874 11.8566C4.10298 11.6609 3.99914 11.3965 3.99988 11.1213C4.00063 10.8461 4.10591 10.5824 4.29272 10.3878C4.47953 10.1932 4.73269 10.0835 4.99689 10.0827C5.26109 10.0819 5.51485 10.1901 5.70274 10.3836L8.19591 12.9801L14.2887 6.6335C14.4767 6.4402 14.7304 6.3322 14.9945 6.33307C15.2586 6.33395 15.5116 6.44362 15.6983 6.63815C15.8851 6.83268 15.9903 7.09627 15.9912 7.37137C15.992 7.64647 15.8883 7.91073 15.7027 8.10648L8.90294 15.1896C8.8102 15.2865 8.7 15.3633 8.57867 15.4157C8.45734 15.4681 8.32727 15.4949 8.19594 15.4948Z"
                                                    fill="white"
                                                ></path>
                                            </g>
                                        </svg>
                                    ) : (
                                        <svg
                                            width="21"
                                            height="21"
                                            viewBox="0 0 21 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g id="Group 335">
                                                <rect
                                                    id="Rectangle 331"
                                                    x="-0.00012207"
                                                    y="6.10352e-05"
                                                    width="21"
                                                    height="21"
                                                    rx="4"
                                                    className="fill-transparent"
                                                    stroke="#00B047"
                                                ></rect>
                                            </g>
                                        </svg>
                                    )}

                                    <span className="text-xl text-[#424242]">
                                        Remember Password
                                    </span>
                                </label>
                                <Link to="/forget-password" className="text-[#00c0b5] text-xl">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-1/3 bg-[#0064D2] text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5 disabled:opacity-60"
                                >
                                    {isLoading ? "Logging in..." : "Log In"}
                                </button>
                                <Link to="/sign-up" className="w-1/3 text-center border border-[#0064D2] text-[#0064D2] font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5">
                                    Create account
                                </Link>
                            </div>
                            {error ? (
                                <p className="text-red-500 text-center mt-4 text-sm">{error?.data?.message || "Login failed"}</p>
                            ) : null}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}