import React from 'react';

export default function Advertising() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-10 md:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
            <div>
              <span className="inline-block text-xs md:text-sm font-semibold tracking-wide uppercase text-[#0064D2] bg-[#0064D2]/10 px-3 py-1 rounded-full">Fasify Media Network</span>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Reach travelers wherever they are
              </h1>
              <p className="mt-3 md:mt-5 text-gray-600 text-sm md:text-lg max-w-xl">
                Engage travelers across their booking journey with the leading travel media network. From inspiration to purchase, get your brand in front of high-intent audiences.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#contact" className="bg-[#0064D2] hover:bg-[#0052A3] text-white font-semibold px-5 py-2.5 rounded-lg">Get started</a>
                <a href="#formats" className="border border-[#0064D2] text-[#0064D2] hover:bg-[#0064D2]/5 font-semibold px-5 py-2.5 rounded-lg">Ad formats</a>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-100">
              <div className="relative pb-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Fasify Media Network"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stand out. Shape decisions. */}
      <section className="bg-[#F6F8FF] mt-12 md:mt-20">
        <div className="container mx-auto px-4 py-10 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Stand out. Shape decisions.</h2>
          <p className="mt-3 max-w-2xl mx-auto text-gray-600 text-sm md:text-base">
            Inspire, inform, and convert with solutions built for travel marketers. Tell your story across premium placements and trusted contexts.
          </p>
        </div>
      </section>

      {/* Solutions grid */}
      <section id="formats" className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Display Advertising */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-6">
                <h3 className="text-xl font-semibold">Display advertising</h3>
                <p className="mt-2 text-gray-600 text-sm md:text-base">
                  High-impact, viewable placements across desktop and mobile to drive awareness and consideration.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc pl-5">
                  <li>Native and programmatic options</li>
                  <li>Audience and contextual targeting</li>
                  <li>Brand-safe environments</li>
                </ul>
              </div>
              <div className="relative min-h-[180px] bg-gray-100">
                <img src="/ads/display.jpg" alt="Display advertising" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Sponsored Listings */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-6">
                <h3 className="text-xl font-semibold">Sponsored listings</h3>
                <p className="mt-2 text-gray-600 text-sm md:text-base">
                  Boost visibility at the moment of intent. Promote properties, attractions, or services to the top of search results.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc pl-5">
                  <li>Cost-per-click model</li>
                  <li>Bid controls and pacing</li>
                  <li>Performance reporting</li>
                </ul>
              </div>
              <div className="relative min-h-[180px] bg-gray-100">
                <img src="/ads/sponsored.jpg" alt="Sponsored listings" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Online video */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-6">
                <h3 className="text-xl font-semibold">Online video</h3>
                <p className="mt-2 text-gray-600 text-sm md:text-base">
                  Tell richer stories with sound-on video across premium environments that travelers trust.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc pl-5">
                  <li>Skippable and non-skippable formats</li>
                  <li>In-feed and in-stream placements</li>
                  <li>Brand lift and attention metrics</li>
                </ul>
              </div>
              <div className="relative min-h-[180px] bg-gray-100">
                <img src="/ads/video.jpg" alt="Online video" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Content collaborations */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-6">
                <h3 className="text-xl font-semibold">Content collaborations</h3>
                <p className="mt-2 text-gray-600 text-sm md:text-base">
                  Partner with our creative team to produce editorial-style content that inspires travel.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc pl-5">
                  <li>Destination guides and spotlights</li>
                  <li>Creator and influencer programs</li>
                  <li>Distribution across channels</li>
                </ul>
              </div>
              <div className="relative min-h-[180px] bg-gray-100">
                <img src="/ads/content.jpg" alt="Content collaborations" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience highlight */}
      <section className="bg-[#F6F8FF]">
        <div className="container mx-auto px-4 py-10 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Unmatched audience of travelers</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <p className="text-3xl md:text-4xl font-extrabold text-[#0064D2]">10M+</p>
              <p className="mt-2 text-xs md:text-sm text-gray-600">Monthly active users</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <p className="text-3xl md:text-4xl font-extrabold text-[#0064D2]">65%</p>
              <p className="mt-2 text-xs md:text-sm text-gray-600">Plan to book within 30 days</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <p className="text-3xl md:text-4xl font-extrabold text-[#0064D2]">80+</p>
              <p className="mt-2 text-xs md:text-sm text-gray-600">Countries and territories</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <p className="text-3xl md:text-4xl font-extrabold text-[#0064D2]">4.8/5</p>
              <p className="mt-2 text-xs md:text-sm text-gray-600">Avg. traveler satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden mt-10 md:mt-16 bg-[url('/ads/banner.jpg')] bg-cover bg-center">
            <div className="bg-black/50">
              <div className="px-6 md:px-10 py-12 md:py-20 text-white text-center">
                <p className="uppercase tracking-wide text-xs md:text-sm">Grow with us</p>
                <h3 className="text-2xl md:text-4xl font-extrabold mt-2">Take your ads to the next level</h3>
                <a href="#contact" className="inline-block mt-6 bg-white text-gray-900 hover:bg-gray-100 font-semibold px-5 py-2.5 rounded-lg">Contact sales</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="news" className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Advertising resources</h2>
            <p className="mt-2 text-gray-600 text-sm md:text-base">Insights and inspiration to help you plan your next campaign.</p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="#" className="block bg-white rounded-2xl shadow p-5 hover:shadow-md transition-shadow">
              <p className="text-xs text-[#0064D2] font-semibold">Guide</p>
              <h3 className="mt-2 font-semibold">Advertising checklist for travel brands</h3>
              <p className="mt-1 text-sm text-gray-600">A step-by-step plan to create campaigns that convert.</p>
            </a>
            <a href="#" className="block bg-white rounded-2xl shadow p-5 hover:shadow-md transition-shadow">
              <p className="text-xs text-[#0064D2] font-semibold">Blog</p>
              <h3 className="mt-2 font-semibold">5 creative formats to inspire bookings</h3>
              <p className="mt-1 text-sm text-gray-600">See ideas from top-performing campaigns.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact" className="bg-[#F6F8FF]">
        <div className="container mx-auto px-4 py-10 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to reach more travelers?</h2>
          <p className="mt-2 text-gray-600 text-sm md:text-base">Tell us your goals and we’ll recommend the right solutions.</p>
          <a href="mailto:ads@fasify.com" className="inline-block mt-6 bg-[#0064D2] hover:bg-[#0052A3] text-white font-semibold px-5 py-2.5 rounded-lg">Email our team</a>
        </div>
      </section>
    </div>
  );
}
