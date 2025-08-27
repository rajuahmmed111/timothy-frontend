import React from "react"
import { Instagram, Facebook, Youtube } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-black text-white relative overflow-hidden">
            {/* Background FASIFY text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-gray-800/20 select-none">
                    FASIFY
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Company Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    About FASIFY
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Service Provider
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Offers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    List Your Property
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Partnership
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Social</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                    <Instagram className="w-4 h-4 text-pink-500" />
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                    <Facebook className="w-4 h-4 text-blue-500" />
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                    <Youtube className="w-4 h-4 text-red-500" />
                                    Youtube
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Terms & Settings Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Terms & Settings</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Privacy & Cookies
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Terms & Condition
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Help Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Help</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Cancel You Reservation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Refund Timeline, Policies & Process
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Us Button */}
                <div className="flex justify-end mb-8">
                    {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Contact Us</Button> */}
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-400 text-sm border-t border-gray-800 pt-6">
                    © 2025, FASIFY, All Rights Reserved.
                </div>
            </div>
        </footer>
    )
}
