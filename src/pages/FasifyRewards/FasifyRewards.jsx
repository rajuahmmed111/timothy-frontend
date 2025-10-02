import React from 'react';
import { Link } from 'react-router-dom';

export default function FasifyRewards() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-[url('/rewards-hero.jpg')] bg-cover bg-center">
        <div className="bg-black/50">
          <div className="container mx-auto px-4 py-14 md:py-20 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold">Fasify Rewards</h1>
            <p className="mt-3 md:mt-4 text-sm md:text-lg max-w-2xl">
              Our loyalty program that thanks you for choosing Fasify. Earn points on every booking and unlock exclusive benefits.
            </p>
            <div className="mt-6">
              <Link to="/offers" className="inline-block bg-[#0064D2] hover:bg-[#0052A3] text-white font-semibold px-5 py-2.5 rounded-lg">
                Explore Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How it works</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-lg font-semibold">Join for free</h3>
            <p className="mt-2 text-gray-600 text-sm">Create a Fasify account in seconds. Membership is free and automatic with your first booking.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-lg font-semibold">Earn on every booking</h3>
            <p className="mt-2 text-gray-600 text-sm">Collect points when you book Stays, Cars, Attractions or Security services on Fasify.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-lg font-semibold">Redeem and unlock perks</h3>
            <p className="mt-2 text-gray-600 text-sm">Use points for discounts and climb tiers to unlock premium benefits.</p>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="container mx-auto px-4 pb-10 md:pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Member tiers</h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Advance through tiers by earning points within a 12-month period.</p>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Blue */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="bg-blue-600 text-white px-5 py-3 font-semibold">Blue</div>
            <div className="p-5 space-y-3 text-sm text-gray-700">
              <div>• 0–1,999 pts</div>
              <div>• 1 point per $1 spent</div>
              <div>• Member-only prices</div>
              <div>• Birthday bonus: 100 pts</div>
            </div>
          </div>
          {/* Silver */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="bg-gray-500 text-white px-5 py-3 font-semibold">Silver</div>
            <div className="p-5 space-y-3 text-sm text-gray-700">
              <div>• 2,000–4,999 pts</div>
              <div>• 1.25 points per $1 spent</div>
              <div>• Priority support</div>
              <div>• Early access to deals</div>
            </div>
          </div>
          {/* Gold */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="bg-yellow-500 text-white px-5 py-3 font-semibold">Gold</div>
            <div className="p-5 space-y-3 text-sm text-gray-700">
              <div>• 5,000+ pts</div>
              <div>• 1.5 points per $1 spent</div>
              <div>• Complimentary upgrades (where available)</div>
              <div>• Late checkout (subject to availability)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="container mx-auto px-4 pb-10 md:pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Benefits you’ll love</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold">Exclusive member prices</h3>
            <p className="mt-2 text-gray-600 text-sm">Save instantly with rates only visible to Fasify Rewards members.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold">Flexible redemptions</h3>
            <p className="mt-2 text-gray-600 text-sm">Use points for partial or full discounts when you pay.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold">Partner perks</h3>
            <p className="mt-2 text-gray-600 text-sm">Enjoy occasional extras like lounge access, insurance discounts, and more.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-10 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Start earning in minutes</h2>
          <p className="mt-2 text-gray-600 text-sm md:text-base">Sign in or create a free account to join Fasify Rewards automatically.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/logIn" className="bg-[#0064D2] hover:bg-[#0052A3] text-white font-semibold px-5 py-2.5 rounded-lg">Sign in</Link>
            <Link to="/logIn" className="border border-[#0064D2] text-[#0064D2] hover:bg-[#0064D2]/5 font-semibold px-5 py-2.5 rounded-lg">Create account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
