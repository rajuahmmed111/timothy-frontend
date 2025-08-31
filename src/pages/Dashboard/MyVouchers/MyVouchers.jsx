import React, { useState } from "react";
import { Gift, Calendar, Clock, Tag, Search, Filter } from "lucide-react";

export default function MyVouchers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const vouchers = [
        {
            id: 1,
            title: "Hotel Booking Discount",
            code: "HOTEL20",
            discount: "20% OFF",
            description: "Get 20% off on all hotel bookings",
            expiryDate: "2024-12-31",
            status: "active",
            category: "Hotel",
            minAmount: "$100",
            usageCount: "0/3"
        },
        {
            id: 2,
            title: "Car Rental Special",
            code: "CAR15",
            discount: "$50 OFF",
            description: "Save $50 on car rentals above $200",
            expiryDate: "2024-11-15",
            status: "active",
            category: "Car Rental",
            minAmount: "$200",
            usageCount: "1/1"
        },
        {
            id: 3,
            title: "Event Ticket Discount",
            code: "EVENT25",
            discount: "25% OFF",
            description: "25% discount on event tickets",
            expiryDate: "2024-10-30",
            status: "expired",
            category: "Events",
            minAmount: "$50",
            usageCount: "0/5"
        },
        {
            id: 4,
            title: "Security Service Deal",
            code: "SECURE10",
            discount: "10% OFF",
            description: "10% off on security services",
            expiryDate: "2025-01-31",
            status: "active",
            category: "Security",
            minAmount: "$150",
            usageCount: "2/10"
        },
        {
            id: 5,
            title: "First Time User Bonus",
            code: "WELCOME30",
            discount: "30% OFF",
            description: "Welcome bonus for new users",
            expiryDate: "2024-09-15",
            status: "used",
            category: "General",
            minAmount: "$75",
            usageCount: "1/1"
        }
    ];

    const filteredVouchers = vouchers.filter(voucher => {
        const matchesSearch = voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voucher.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || voucher.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 border-green-200";
            case "expired":
                return "bg-red-100 text-red-800 border-red-200";
            case "used":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Hotel":
                return "🏨";
            case "Car Rental":
                return "🚗";
            case "Events":
                return "🎫";
            case "Security":
                return "🛡️";
            default:
                return "🎁";
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Voucher code ${code} copied to clipboard!`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Summary Stats */}
            <div className="container mx-auto mt-10 grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{vouchers.filter(v => v.status === 'active').length}</div>
                    <div className="text-sm text-gray-600">Active Vouchers</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{vouchers.filter(v => v.status === 'used').length}</div>
                    <div className="text-sm text-gray-600">Used Vouchers</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{vouchers.filter(v => v.status === 'expired').length}</div>
                    <div className="text-sm text-gray-600">Expired Vouchers</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{vouchers.length}</div>
                    <div className="text-sm text-gray-600">Total Vouchers</div>
                </div>
            </div>
            <div className="container mx-auto mt-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Vouchers</h1>
                    <p className="text-gray-600">Manage and use your discount vouchers</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search vouchers by title or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-400 w-5 h-5" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="used">Used</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Vouchers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-5">
                    {filteredVouchers.map((voucher) => (
                        <div key={voucher.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                            {/* Voucher Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-2xl">{getCategoryIcon(voucher.category)}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(voucher.status)}`}>
                                        {voucher.status.toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{voucher.title}</h3>
                                <p className="text-blue-100 text-sm">{voucher.category}</p>
                            </div>

                            {/* Voucher Body */}
                            <div className="p-4">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl font-bold text-green-600">{voucher.discount}</span>
                                        <Gift className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 text-sm">{voucher.description}</p>
                                </div>

                                {/* Voucher Code */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">VOUCHER CODE</label>
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300">
                                        <span className="font-mono font-bold text-lg">{voucher.code}</span>
                                        <button
                                            onClick={() => copyToClipboard(voucher.code)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            disabled={voucher.status !== 'active'}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                {/* Voucher Details */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Min. Amount:</span>
                                        <span className="font-medium">{voucher.minAmount}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Usage:</span>
                                        <span className="font-medium">{voucher.usageCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Expires:
                                        </span>
                                        <span className="font-medium">{new Date(voucher.expiryDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="mt-4">
                                    {voucher.status === 'active' ? (
                                        <button className="w-full bg-[#0064D2] text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                            Use Voucher
                                        </button>
                                    ) : voucher.status === 'expired' ? (
                                        <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                                            Expired
                                        </button>
                                    ) : (
                                        <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                                            Already Used
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredVouchers.length === 0 && (
                    <div className="text-center py-12">
                        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No vouchers found</h3>
                        <p className="text-gray-600">
                            {searchTerm || filterStatus !== "all"
                                ? "Try adjusting your search or filter criteria"
                                : "You don't have any vouchers yet. Check back later for exclusive deals!"
                            }
                        </p>
                    </div>
                )}


            </div>
        </div>
    );
}
