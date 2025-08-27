import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar/Navbar";
import Footer from "../common/Footer/Footer";


export default function Layout() {
    return (
        <div>
            <Navbar />
            <div className="bg-[#fff] pt-[64px]">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}