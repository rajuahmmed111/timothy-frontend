import React from "react"
import { Instagram, Facebook, Youtube } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-gray-800/20 select-none">
                    FASIFY
                </div>
            </div>
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
                    {/* Company Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                                    About FASIFY
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                                    Service Provider
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                                    Offers
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                                    List Your Property
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                                    Partnership
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Social</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                    <Instagram className="w-4 h-4 text-pink-500" />
                                    Instagram
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                    <Facebook className="w-4 h-4 text-blue-500" />
                                    Facebook
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                    <Youtube className="w-4 h-4 text-red-500" />
                                    Youtube
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Terms & Settings Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Terms & Settings</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Privacy & Cookies
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Terms & Condition
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Help</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Cancel You Reservation
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Refund Timeline, Policies & Process
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us Button */}
                    <div className="flex justify-end items-center w-full mb-8">
                        <button className="bg-[#0064D2] text-white px-6 py-2 rounded-lg">Contact Us</button>
                    </div>
                </div>

                <div className="text-center text-gray-200 pt-5">
                    © 2025, FASIFY, All Rights Reserved.
                </div>
            </div>
        </footer>
    )
}
