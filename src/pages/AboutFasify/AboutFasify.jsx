import React from "react";
import { Link } from "react-router-dom";

export default function AboutFasify() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold mb-6">
          Fasify – Brand Story, Mission &amp; Vision
        </h1>

        {/* Brand Story */}
        <Section title="Brand Story">
          <p className="mb-4">
            Fasify was created with a simple belief: travel should be
            effortless. Born from the real frustrations that travelers
            face—complex bookings, unreliable platforms, and overwhelming
            choices—Fasify set out to redesign the journey.
          </p>
          <p className="mb-4">
            Our story is about empowering people to explore the world with
            confidence, comfort, and convenience. From quick city breaks to
            special getaways, Fasify brings clarity and simplicity to every step
            of the travel process.
          </p>
          <p className="mb-4">
            With roots in both the United Kingdom and Nigeria, Fasify bridges
            global experiences with local realities, making smart travel
            accessible to everyone. As we grow, our commitment remains the same:
            to elevate travel through innovation, trust, and exceptional user
            experience.
          </p>
        </Section>

        {/* Mission */}
        <Section title="Mission">
          <p>
            Our mission is to simplify and elevate the travel experience by
            providing a seamless, secure, and intuitive platform that connects
            travelers with quality accommodations and services. We aim to build
            a smarter way for people to explore, plan, and enjoy their journeys.
          </p>
        </Section>

        {/* Vision */}
        <Section title="Vision">
          <p>
            Our vision is to become the leading travel technology platform in
            Africa and beyond, championing innovation, trust, and accessibility.
            We aspire to create a world where every traveler—regardless of
            location—can enjoy stress-free, well-informed, and personalized
            travel experiences.
          </p>
        </Section>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

/* Reusable Section Component */
function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}
