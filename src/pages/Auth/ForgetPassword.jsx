import React from "react";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen flex items-center justify-center p-5">
            <div className="container mx-auto">
                <div className="flex  justify-center items-center ">
                    <div className="w-full md:w-1/2 lg:w-1/2 p-5 md:px-[100px] md:py-[200px] bg-white  shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
                        <h2 className="text-[#0D0D0D] text-2xl  font-bold text-center mb-5">
                            Forgot password ?
                        </h2>
                        <form className="space-y-5">
                            <div>
                                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="nahidhossain@gmail.com"
                                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                                    required
                                />
                            </div>

                            <div className="flex justify-center items-center">
                                <button
                                    onClick={() => navigate("/verification-code")}
                                    type="button"
                                    className="w-1/3 bg-[#0064D2] text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5"
                                >
                                    Send Code
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}