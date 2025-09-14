import React from "react";
import { Calendar, User, ArrowRight, ExternalLink } from "lucide-react";

export default function Newsroom() {
  const newsArticles = [
    {
      id: 1,
      title: "FASIFY Announces Strategic Partnership with Leading Hotel Chains",
      excerpt: "Expanding our network to bring you more accommodation options worldwide with exclusive deals and enhanced booking experiences.",
      date: "2024-12-15",
      author: "Sarah Johnson",
      category: "Partnership",
      image: "/news/partnership.jpg",
      featured: true
    },
    {
      id: 2,
      title: "New AI-Powered Recommendation System Launches",
      excerpt: "Our latest technology update uses machine learning to provide personalized hotel recommendations based on your preferences and travel history.",
      date: "2024-12-10",
      author: "Michael Chen",
      category: "Technology",
      image: "/news/ai-tech.jpg",
      featured: false
    },
    {
      id: 3,
      title: "FASIFY Rewards Program Reaches 1 Million Members",
      excerpt: "Celebrating this milestone with exclusive benefits and rewards for our loyal customers worldwide.",
      date: "2024-12-05",
      author: "Emily Rodriguez",
      category: "Milestone",
      image: "/news/rewards.jpg",
      featured: false
    },
    {
      id: 4,
      title: "Sustainable Travel Initiative: Carbon Neutral Bookings",
      excerpt: "Introducing our new eco-friendly booking options that help offset carbon emissions for environmentally conscious travelers.",
      date: "2024-11-28",
      author: "David Park",
      category: "Sustainability",
      image: "/news/sustainability.jpg",
      featured: false
    },
    {
      id: 5,
      title: "Q3 2024 Financial Results: Record Growth in Bookings",
      excerpt: "FASIFY reports 45% year-over-year growth in hotel bookings and expansion into 15 new markets across Asia and Europe.",
      date: "2024-11-20",
      author: "Jennifer Liu",
      category: "Financial",
      image: "/news/growth.jpg",
      featured: false
    },
    {
      id: 6,
      title: "Mobile App Update: Enhanced User Experience",
      excerpt: "Latest version includes faster booking, improved search filters, and seamless payment integration for better user experience.",
      date: "2024-11-15",
      author: "Alex Thompson",
      category: "Product",
      image: "/news/mobile-app.jpg",
      featured: false
    }
  ];

  const pressReleases = [
    {
      title: "FASIFY Wins 'Best Travel Platform' Award 2024",
      date: "2024-12-01",
      link: "#"
    },
    {
      title: "CEO Interview: The Future of Digital Travel",
      date: "2024-11-25",
      link: "#"
    },
    {
      title: "FASIFY Expands Operations to Southeast Asia",
      date: "2024-11-18",
      link: "#"
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Partnership: "bg-blue-100 text-blue-800",
      Technology: "bg-purple-100 text-purple-800",
      Milestone: "bg-green-100 text-green-800",
      Sustainability: "bg-emerald-100 text-emerald-800",
      Financial: "bg-orange-100 text-orange-800",
      Product: "bg-indigo-100 text-indigo-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = newsArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              FASIFY Newsroom
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest news, announcements, and insights from FASIFY. 
              Discover our journey in revolutionizing the travel and hospitality industry.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Article */}
            {featuredArticle && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Story</h2>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">Featured Image</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(featuredArticle.category)}`}>
                        {featuredArticle.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(featuredArticle.date)}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <User className="w-4 h-4 mr-2" />
                        {featuredArticle.author}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {featuredArticle.excerpt}
                    </p>
                    <button className="inline-flex items-center text-[#0064D2] font-semibold hover:text-[#0052A3] transition-colors">
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent News */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <div className="w-full h-48 bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">News Image</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(article.date)}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {article.author}
                        </div>
                        <button className="text-[#0064D2] text-sm font-medium hover:text-[#0052A3] transition-colors">
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Press Releases */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Press Releases</h3>
              <div className="space-y-4">
                {pressReleases.map((release, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="text-sm font-medium text-gray-900 mb-2 leading-tight">
                      {release.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatDate(release.date)}</span>
                      <a 
                        href={release.link}
                        className="text-[#0064D2] hover:text-[#0052A3] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Contact */}
            <div className="bg-[#0064D2] rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Media Contact</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Press Inquiries</p>
                  <p className="text-sm opacity-90">press@fasify.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Media Relations</p>
                  <p className="text-sm opacity-90">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Business Hours</p>
                  <p className="text-sm opacity-90">Mon-Fri, 9 AM - 6 PM EST</p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gray-100 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Subscribe to our newsletter for the latest news and updates.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0064D2] focus:border-[#0064D2]"
                />
                <button className="w-full bg-[#0064D2] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0052A3] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
