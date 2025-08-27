import React from 'react';
export default function Impact() {
    return (
        <section className="py-16 container mx-auto">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-medium text-gray-600 uppercase text-start">OUR IMPACT IN NUMBERS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="text-start bg-[#F7F7F7] px-5 py-10 rounded-2xl">
                        <div className="text-[5rem] font-bold text-gray-900 mb-2">99%</div>
                        <div className="text-xl font-bold text-gray-900 mb-2">Guest Happiness</div>
                        <p className="text-gray-600 text-sm">
                            Over 99% of our guests have delighted. Thanks to our team and our thoughtful approach.
                        </p>
                    </div>

                    <div className="text-start bg-[#F7F7F7] px-5 py-10 rounded-2xl">
                        <div className="text-[5rem] font-bold text-gray-900 mb-2">18+</div>
                        <div className="text-xl font-bold text-gray-900 mb-2">Years in Hospitality</div>
                        <p className="text-gray-600 text-sm">
                            With nearly 20 years of combined experience, we know exactly what it takes to deliver an exceptional
                            experience.
                        </p>
                    </div>

                    <div className="text-start bg-[#F7F7F7] px-5 py-10 rounded-2xl">
                        <div className="text-[5rem] font-bold text-gray-900 mb-2">30,000+</div>
                        <div className="text-xl font-bold text-gray-900 mb-2">Guests and Counting</div>
                        <p className="text-gray-600 text-sm">
                            Tens of thousands of travelers have chosen us to provide their trips and we're just getting started.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}