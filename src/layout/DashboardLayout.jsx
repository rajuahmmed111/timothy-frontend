import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar/Navbar";
import Footer from "../common/Footer/Footer";
import Sidebar from "../common/Sidebar/Sidebar";



export default function DashboardLayout() {
    return (
        <div>
            <Navbar />
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1  py-20">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}