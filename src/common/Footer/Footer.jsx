import React from "react"
import { Instagram, Facebook, Youtube } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="bg-[#BCBCBC] text-white relative overflow-hidden">
            {/* <div className="absolute bottom-0 inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-gray-800/20 select-none">
                    FASIFY
                </div>
            </div> */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
                    {/* Company Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/about" className="text-[#090909] hover:text-white transition-colors">
                                    About FASIFY
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/hotel-management" className="text-[#090909] hover:text-white transition-colors">
                                    Partnership
                                </Link>
                            </li>
                            <li>
                                <Link to="/offers" className="text-[#090909] hover:text-white transition-colors">
                                    Offers
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-[#090909] hover:text-white transition-colors">
                                    List Your Property
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Social</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="flex items-center gap-2 text-[#090909] hover:text-white transition-colors">
                                    <Instagram className="w-4 h-4 text-pink-500" />
                                    Instagram
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="flex items-center gap-2 text-[#090909] hover:text-white transition-colors">
                                    <Facebook className="w-4 h-4 text-blue-500" />
                                    Facebook
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="flex items-center gap-2 text-[#090909] hover:text-white transition-colors">
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
                                <Link to="/privacy-policy" className="text-[#090909] hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-and-conditions" className="text-[#090909] hover:text-white transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/dispute-resolution" className="text-[#090909] hover:text-white transition-colors">
                                    Dispute Resolution
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Help</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/cancel-reservation" className="text-[#090909] hover:text-white transition-colors">
                                    Cancel Your Reservation
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund-policies" className="text-[#090909] hover:text-white transition-colors">
                                    Refund Timeline, Policies & Process
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us Button */}
                    <div className="flex justify-end items-center w-full mb-8">
                        <Link to="/contact-us" className="bg-[#0064D2] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>

                <div className="text-center text-gray-200 pt-5">
                    © 2025, FASIFY, All Rights Reserved.
                </div>
            </div>
        </footer>
    )
}
