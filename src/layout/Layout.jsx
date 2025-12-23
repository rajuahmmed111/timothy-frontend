import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar/Navbar";
import Footer from "../common/Footer/Footer";
import ToastProvider from "../common/Toast/ToastProvider";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

export default function Layout() {
  return (
    <div>
      <ScrollToTop />
      <ToastProvider />
      <Navbar />
      <div className="bg-[#fff] pt-[64px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
