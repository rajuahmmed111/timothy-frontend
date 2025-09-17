import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function InvestorRelations() {
  const events = [
    { date: 'February 7, 2025 at 4:30 PM PT', title: "Fasify Group Q4 2024 Earnings Call" },
    { date: 'May 8, 2025 at 1:00 PM PT', title: "Fasify Group 2025 Investor Day" },
  ];

  const results = [
    { label: 'Q2 2025 Earnings Release', href: '#' },
    { label: 'Q2 2025 Earnings Presentation', href: '#' },
    { label: 'Q2 2025 Earnings Call Transcript', href: '#' },
    { label: 'Form 10-Q', href: '#' },
  ];

  const news = [
    {
      title: 'Fasify Group Reports Record Q2 Bookings and Margin Expansion',
      date: 'August 2, 2025',
      excerpt: 'Strong traveler demand and new product initiatives drove another quarter of profitable growth.',
      href: '#',
    },
    {
      title: 'Fasify Travel Partners: Boosting Growth through Innovation and Efficiency',
      date: 'July 10, 2025',
      excerpt: 'New partner tools help suppliers reach high-intent travelers with better conversion and ROI.',
      href: '#',
    },
    {
      title: 'Fasify Group Unveils AI Trip Planning with Responsible Guardrails',
      date: 'June 18, 2025',
      excerpt: 'A safer, smarter planning experience with transparency and traveler trust at the center.',
      href: '#',
    },
  ];

  const brands = [
    'fasify', 'hotels', 'air', 'car', 'attractions', 'trips'
  ];

  return (
    <div className="bg-white">
      {/* Top Nav band mimic */}
      <div className="bg-[#0A29B5]">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold">Investor Relations</h1>
        </div>
      </div>

      {/* Tabs band mimic */}
      <div className="bg-[#0A29B5]">
        <div className="container mx-auto px-4">
          <div className="border-t border-white/20" />
        </div>
      </div>

      {/* Company Overview */}
      <section className="bg-[#0A29B5] text-white">
        <div className="container mx-auto px-4 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">Company Overview</h2>
            <p className="mt-3 text-sm md:text-base max-w-xl text-white/90">
              Fasify Group powers travelers and partners worldwide with an end‑to‑end travel platform. We build
              seamless experiences across lodging, transportation, and activities while delivering sustainable growth
              and value for our stakeholders.
            </p>
          </div>
          <div className="relative">
            <div className="relative w-full max-w-md ml-auto">
              <div className="aspect-square rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img src="/investor/overview.jpg" alt="Company overview" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-6 left-6 bg-white text-gray-900 rounded-xl shadow p-4 w-60">
                <p className="text-xs font-semibold text-gray-500">NASDAQ: FAS</p>
                <p className="mt-1 text-2xl font-extrabold">$225.18 <span className="text-green-600 text-sm align-middle">+0.30</span></p>
                <p className="text-xs text-gray-500">As of 4:00 PM ET. Delayed 15 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events and Quarterly Results */}
      <section className="bg-[#EEF1FF]">
        <div className="container mx-auto px-4 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#2D3BE6] rounded-2xl p-6 text-white">
            <h3 className="text-lg md:text-xl font-semibold">Investor Events</h3>
            <div className="mt-4 divide-y divide-white/20">
              {events.map((e, i) => (
                <div key={i} className="py-3">
                  <p className="text-xs md:text-sm text-white/80">{e.date}</p>
                  <p className="text-sm md:text-base font-medium">{e.title}</p>
                </div>
              ))}
            </div>
            <Link to="#" className="inline-flex items-center gap-1 mt-4 text-white font-semibold">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="bg-[#2D3BE6] rounded-2xl p-6 text-white">
            <h3 className="text-lg md:text-xl font-semibold">Quarterly Results / Q2 2025</h3>
            <div className="mt-4 divide-y divide-white/20">
              {results.map((r, i) => (
                <Link key={i} to={r.href} className="py-3 block hover:underline">
                  {r.label}
                </Link>
              ))}
            </div>
            <Link to="#" className="inline-flex items-center gap-1 mt-4 text-white font-semibold">View all <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Annual Reports & Proxy', icon: '📄', href: '#' },
              { title: 'SEC Filings', icon: '🏛️', href: '#' },
              { title: 'Stock Information', icon: '📈', href: '#' },
            ].map((q) => (
              <Link key={q.title} to={q.href} className="group relative overflow-hidden rounded-2xl shadow hover:shadow-md transition-shadow">
                <img src="/investor/quick.jpg" alt="Quick link" className="h-40 w-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 p-5 flex items-end">
                  <div>
                    <div className="text-white text-2xl">{q.icon}</div>
                    <p className="text-white font-semibold mt-2">{q.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-[#F5F7FF]">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">Latest News</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((n) => (
              <Link key={n.title} to={n.href} className="block bg-white rounded-2xl shadow p-5 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500">{n.date}</p>
                <h4 className="mt-2 font-semibold">{n.title}</h4>
                <p className="mt-2 text-sm text-gray-600">{n.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[#0A29B5] font-semibold">Read more <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link to="#" className="inline-flex items-center gap-1 text-[#0A29B5] font-semibold">View all <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-80">
            {brands.map((b) => (
              <div key={b} className="h-8 bg-gray-200 rounded w-28 flex items-center justify-center text-gray-500 text-xs uppercase">{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Email alerts & IR contact */}
      <section className="bg-[#0A29B5]">
        <div className="container mx-auto px-4 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">Email Alerts</h3>
            <p className="mt-2 text-sm text-gray-600">Get the latest investor materials delivered to your inbox.</p>
            <form className="mt-4 flex gap-2">
              <input type="email" placeholder="Enter email address" className="flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0A29B5]" />
              <button type="button" className="px-5 py-2.5 rounded-lg bg-[#0A29B5] text-white font-semibold">Sign up</button>
            </form>
            <div className="mt-2 text-xs text-gray-500">You can unsubscribe at any time.</div>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">IR Contact</h3>
            <p className="mt-2 text-sm text-gray-600">investors@fasify.com</p>
            <p className="text-sm text-gray-600">+1 (415) 555-0182</p>
            <Link to="#" className="inline-flex items-center gap-1 mt-4 text-[#0A29B5] font-semibold">Request a meeting <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
