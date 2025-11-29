import React from "react";
export default function Impact() {
  return (
    <section className="py-8 md:pt-16 container mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xs sm:text-sm font-medium text-gray-600 uppercase text-start">
            OUR IMPACT IN NUMBERS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <div className="text-start bg-[#F7F7F7] px-4 md:px-5 py-6 md:py-10 rounded-2xl">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-gray-900 mb-2">
              99%
            </div>
            <div className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              Guest Happiness
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Over 99% of our guests have delighted. Thanks to our team and our
              thoughtful approach.
            </p>
          </div>

          <div className="text-start bg-[#F7F7F7] px-4 md:px-5 py-6 md:py-10 rounded-2xl">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-gray-900 mb-2">
              18+
            </div>
            <div className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              Years in Hospitality
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              At Fastify, we transform decades of hospitality expertise into a
              modern, seamless, and unforgettable experience. By combining
              innovative technology with world-class service, we deliver
              exceptional convenience, comfort, and personalization—right at
              your fingertips.
            </p>
          </div>

          <div className="text-start bg-[#F7F7F7] px-4 md:px-5 py-6 md:py-10 rounded-2xl">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-gray-900 mb-2">
              30,000+
            </div>
            <div className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              Guests and Counting
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tens of thousands of travelers have chosen us to provide their
              trips and we're just getting started.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
