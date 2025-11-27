import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function InvestorRelations() {
  const events = [
    {
      date: "February 7, 2025 at 4:30 PM PT",
      title: "Fasify Group Q4 2024 Earnings Call",
    },
    {
      date: "May 8, 2025 at 1:00 PM PT",
      title: "Fasify Group 2025 Investor Day",
    },
  ];

  const results = [
    { label: "Q2 2025 Earnings Release", href: "#" },
    { label: "Q2 2025 Earnings Presentation", href: "#" },
    { label: "Q2 2025 Earnings Call Transcript", href: "#" },
    { label: "Form 10-Q", href: "#" },
  ];

  const news = [
    {
      title: "Fasify Group Reports Record Q2 Bookings and Margin Expansion",
      date: "August 2, 2025",
      excerpt:
        "Strong traveler demand and new product initiatives drove another quarter of profitable growth.",
      href: "#",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
    },
    {
      title:
        "Fasify Travel Partners: Boosting Growth through Innovation and Efficiency",
      date: "July 10, 2025",
      excerpt:
        "New partner tools help suppliers reach high-intent travelers with better conversion and ROI.",
      href: "#",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    },
    {
      title:
        "Fasify Group Unveils AI Trip Planning with Responsible Guardrails",
      date: "June 18, 2025",
      excerpt:
        "A safer, smarter planning experience with transparency and traveler trust at the center.",
      href: "#",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    },
  ];

const brands = [
  {
    name: "fasify",
    logo: "https://www.svgrepo.com/show/530438/travel.svg",
  },
  {
    name: "hotels",
    logo: "https://www.svgrepo.com/show/521699/hotel.svg",
  },
  {
    name: "air",
    logo: "https://www.svgrepo.com/show/510930/airplane.svg",
  },
  {
    name: "car",
    logo: "https://www.svgrepo.com/show/448230/car-rental.svg",
  },
  {
    name: "attractions",
    logo: "https://www.svgrepo.com/show/503037/tickets.svg",
  },
  {
    name: "trips",
    logo: "https://www.svgrepo.com/show/530020/map-pin.svg",
  },
];

  return (
    <div className="bg-white">
      {/* Overview image fixed */}
      <section className="bg-[#0A29B5] text-white">
        <div className="container mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold">Company Overview</h2>
            <p className="mt-3 text-white/90 max-w-xl">
              Fasify Group powers travelers and partners worldwide with an
              end-to-end travel platform.
            </p>
          </div>

          <div className="relative max-w-md ml-auto">
            <div className="aspect-square rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links image fixed */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Annual Reports & Proxy", icon: "📄", href: "#" },
              { title: "SEC Filings", icon: "🏛️", href: "#" },
              { title: "Stock Information", icon: "📈", href: "#" },
            ].map((q) => (
              <Link
                key={q.title}
                className="relative rounded-2xl overflow-hidden shadow hover:shadow-md"
              >
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
                  className="h-40 w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 p-5 flex items-end">
                  <div>
                    <p className="text-white text-2xl">{q.icon}</p>
                    <p className="text-white font-semibold mt-2">{q.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News images fixed */}
      <section className="bg-[#F5F7FF]">
        <div className="container mx-auto px-4 py-14">
          <h3 className="text-2xl font-bold text-gray-900">Latest News</h3>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((n) => (
              <Link
                key={n.title}
                className="bg-white rounded-2xl shadow hover:shadow-md overflow-hidden"
              >
                <img src={n.image} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs text-gray-500">{n.date}</p>
                  <h4 className="mt-2 font-semibold">{n.title}</h4>
                  <p className="mt-2 text-sm text-gray-600">{n.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Logos fixed */}
  
    </div>
  );
}
