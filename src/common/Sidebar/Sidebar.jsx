import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Lock,
    MessageSquare,
    CreditCard,
    List,
    Pin,
    Mail,
    User,
    X,
    ChevronLeft,
    ChevronRight,
    Package,
    ReceiptText
} from "lucide-react";

export default function Sidebar() {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // Check on initial render
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            {/* Mobile toggle button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-[84px] left-0 z-50 p-2 rounded-md bg-[#3c3d37] text-white cursor-pointer transform transition-transform duration-300 ease-in-out"
                >
                    {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`w-70 bg-gray-50 p-4 mt-[150px] ${isMobile
                    ? `fixed top-0 w-80 pl-10 left-0 h-full z-40 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out`
                    : ""
                    }`}
            >
                {/* Close button for mobile */}
                {isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Profile */}
                <Section
                    isActive={isSectionActive(location.pathname, [
                        "/dashboard/profile",
                    ])}
                >
                    <SidebarButton
                        to="/dashboard/profile"
                        icon={<User size={18} />}
                        text="My Profile"
                        onClick={isMobile ? toggleSidebar : undefined}
                    />
                </Section>

                {/* User Management */}
                <Section
                    title="User"
                    isActive={isSectionActive(location.pathname, [
                        "/dashboard/my-bookings",
                        "/dashboard/my-vouchers",
                        "/dashboard/payment-methods",

                    ])}
                >
                    <SidebarButton
                        to="/dashboard/payment-methods"
                        icon={<Lock size={18} />}
                        text="Payment Methods"
                        onClick={isMobile ? toggleSidebar : undefined}
                    />
                    <SidebarButton
                        to="/dashboard/my-bookings"
                        icon={<ReceiptText size={18} />}
                        text="My Bookings"
                        onClick={isMobile ? toggleSidebar : undefined}
                    />
                    <SidebarButton
                        to="/dashboard/my-vouchers"
                        icon={<MessageSquare size={18} />}
                        text="My Vouchers"
                        onClick={isMobile ? toggleSidebar : undefined}

                    />
                </Section>

                {/* Service Provider */}
                <Section
                    title="Service Provider"
                    isActive={isSectionActive(location.pathname, [
                        "/dashboard/hotel-management",
                        "/dashboard/security-management",
                        "/dashboard/Car-management",
                        "/dashboard/Attraction-management",
                    ])}
                >
                    <SidebarButton
                        to="/dashboard/hotel-management"
                        icon={<List size={18} />}
                        text="Hotel Management"
                        onClick={isMobile ? toggleSidebar : undefined}
                    />
                    <SidebarButton
                        to="/dashboard/security-management"
                        icon={<Package size={18} />}
                        text="Security Management"
                        onClick={isMobile ? toggleSidebar : undefined}
                    />
                    <SidebarButton
                        to="/dashboard/Car-management"
                        icon={<Pin size={18} />}
                        text="Car Management"
                        onClick={isMobile ? toggleSidebar : undefined}
                    />
                    <SidebarButton
                        to="/dashboard/Attraction-management"
                        icon={<Mail size={18} />}
                        text="Attraction Management"
                        onClick={isMobile ? toggleSidebar : undefined}
                    />
                </Section>
            </div>

            {/* Overlay for mobile */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}

function Section({ title, children, isActive }) {
    return (
        <div className="mb-6">
            <h3
                className={`flex items-center gap-2 font-semibold mb-2 ${isActive ? "text-blue-600" : "text-black"
                    }`}
            >
                {title}
            </h3>
            <div className="flex flex-col gap-2">{children}</div>
        </div>
    );
}

function SidebarButton({ to, icon, text, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md bg-white transition
        ${isActive
                    ? "!bg-[#3b82f6] text-white shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)]"
                    : "shadow-[inset_0_-4px_6px_rgba(0,0,0,0.05)] hover:bg-blue-100 hover:text-black"
                }`
            }
        >
            {icon}
            <span>{text}</span>
        </NavLink>
    );
}

function isSectionActive(pathname, routes) {
    return routes.some((route) => pathname.startsWith(route));
}