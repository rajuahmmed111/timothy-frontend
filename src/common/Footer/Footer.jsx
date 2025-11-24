import React from "react";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-[#BCBCBC] text-white  overflow-hidden">
      <div className="container mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
          {/* Company Section */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-[#090909]">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-[#090909] font-semibold">
                  About FASIFY
                </Link>
              </li>
              <li>
                <Link
                  to="/service-provider/sign-up"
                  className="text-[#090909] font-semibold"
                >
                  Partnerships
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-[#090909] font-semibold">
                  Offers
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#090909] font-semibold">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/newsroom" className="text-[#090909] font-semibold">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link
                  to="/fasify-rewards"
                  className="text-[#090909] font-semibold"
                >
                  Fasify Rewards
                </Link>
              </li>
              <li>
                <Link
                  to="/investor-relations"
                  className="text-[#090909] font-semibold"
                >
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link
                  to="/advertising"
                  className="text-[#090909] font-semibold"
                >
                  Advertising
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-[#090909] font-semibold">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-[#090909]">Social</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-[#090909]"
                >
                  <Instagram className="w-6 h-6 text-[#090909]" />
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-[#090909]"
                >
                  <Facebook className="w-6 h-6" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-[#090909]"
                >
                  <Youtube className="w-6 h-6" />
                  Youtube
                </Link>
              </li>
            </ul>
          </div>

          {/* Terms & Settings Section */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-[#090909]">Settings</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-[#090909] font-semibold"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-[#090909] font-semibold"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/dispute-resolution"
                  className="text-[#090909] font-semibold"
                >
                  Dispute Resolution
                </Link>
              </li>
              <li>
                <Link
                  to="/human-rights-statement"
                  className="text-[#090909] font-semibold"
                >
                  Human Rights Statement
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-[#090909]">Help</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/cancel-reservation"
                  className="text-[#090909] font-semibold"
                >
                  Cancel Your Reservation
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policies"
                  className="text-[#090909] font-semibold"
                >
                  Refund Timeline, Policies & Process
                </Link>
              </li>
              <li>
                <Link
                  to="/fasify-coupon-usage"
                  className="text-[#090909] font-semibold"
                >
                  Use of Fasify Coupon
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us Button */}
          <div className="flex justify-end items-center w-full mb-8">
            <Link
              to="/contact-us"
              className="bg-[#0064D2] text-white px-5 py-2 rounded-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="text-center text-[#090909] pt-5">
          © 2025, FASIFY, All Rights Reserved.
        </div>
      </div>
      {/* Bottom image */}
      <div className="w-full flex justify-center pointer-events-none z-0">
        <img
          src="/bottom.png"
          alt="Footer decoration"
          className="w-full max-w-6xl mx-auto"
        />
      </div>
    </footer>
  );
}
