import React from 'react';
import { Building2, Calendar, Users, Gift, Award } from 'lucide-react';

export default function WhyChooseFASIFY() {
    return (
      <div className=" bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <section className="container mx-auto px-5 md:px-0 py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left side - Main heading and description */}
            <div className="text-white ">
              <h1 className="text-[5rem] lg:text-[7rem] font-bold mb-10 leading-tight">
                Why Choose
                <br />
                <span className="text-white">FASIFY?</span>
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
                Discover what makes FASIFY the smart choice for modern
                travelers. From booking to check-out, we simplify your journey
                with comfort, care, and innovation.
              </p>
            </div>

            {/* Right side - Features grid */}
            <div className="grid md:grid-cols-2 gap-10">
              {/* Years in Hospitality */}
              <div className="text-white space-y-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Years in Hospitality
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    At Fastify, we transform decades of hospitality expertise
                    into a modern, seamless, and unforgettable experience. By
                    combining innovative technology with world-class service, we
                    deliver exceptional convenience, comfort, and
                    personalization—right at your fingertips.
                  </p>
                </div>
              </div>

              {/* Smart Booking System */}
              <div className="text-white space-y-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Smart Booking System
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Our intuitive booking platform helps you find and reserve
                    the perfect accommodation in just a few clicks, stress-free
                    and fast.
                  </p>
                </div>
              </div>

              {/* Trusted by Thousands */}
              <div className="text-white space-y-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Trusted by Thousands
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    With over 30,000 happy travelers and growing, you're in good
                    company when you choose FASIFY.
                  </p>
                </div>
              </div>

              {/* Exclusive Offers & Loyalty Rewards */}
              <div className="text-white space-y-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Exclusive Offers & Loyalty Rewards
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Get access to members-only deals and perks when you book
                    with us regularly. Your loyalty means more with FASIFY.
                  </p>
                </div>
              </div>

              {/* Top-Rated Stays Only - spanning full width */}
              <div className="md:col-span-2 text-white space-y-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Top-Rated Stays Only
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed max-w-lg">
                    All our properties are carefully curated and consistently
                    rated highly by previous guests, ensuring quality you can
                    trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
}