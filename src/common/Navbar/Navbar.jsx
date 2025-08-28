import React, { useState } from "react"
import { ShoppingCart, ChevronDown, Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()
  const navItems = [
    { name: "Stays", url: "/hotel" },
    { name: "Security", url: "/security-reservation" },
    { name: "Car Rental", url: "/car-reservation" },
    { name: "Attraction", url: "/attraction" }
  ]
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("EN")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const languages = [
    { code: "EN", name: "English", flag: "/flags/us.svg" },
    { code: "ES", name: "Español", flag: "/flags/es.svg" },
    { code: "FR", name: "Français", flag: "/flags/fr.svg" },
    { code: "DE", name: "Deutsch", flag: "/flags/de.svg" },
    { code: "IT", name: "Italiano", flag: "/flags/it.svg" }
  ]

  const getCurrentFlag = () => {
    return languages.find(lang => lang.code === selectedLanguage)?.flag || "/flags/us.svg"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200">
      <div className="container mx-auto px-5 md:px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8  rounded flex items-center justify-center">
              <img src="/logo.svg" alt="logo" />
            </div>
            <span className="text-4xl font-bold text-[#0064D2]">FASIFY</span>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden md:flex">
            <div className="flex items-center bg-[#0064D2] rounded-full p-1">
              {navItems.map((item, index) => (
                <Link
                  key={item?.name}
                  to={item?.url}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location.pathname === item.url ? "bg-white text-[#0064D2] shadow-sm" : "text-white"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Dropdown - Hidden on mobile */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img src={getCurrentFlag()} alt="flag" className="w-5 h-4 rounded-full" />
                <span className="text-sm font-medium text-gray-700">{selectedLanguage}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language.code)
                        setIsLanguageOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${selectedLanguage === language.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
                        }`}
                    >
                      <img src={language.flag} alt={`${language.name} flag`} className="w-5 h-4 rounded-full" />
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart - Hidden on mobile */}
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
            </button>

            {/* Auth buttons - Hidden on mobile */}
            <button className="hidden sm:block text-gray-700 hover:text-gray-900 font-medium">Sign In</button>
            <button className="hidden sm:block bg-[#0064D2] text-white px-6 py-2 rounded-full">Sign Up</button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${index === 0 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Language Selector */}
              <div className="border-t border-gray-200 pt-3">
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <img src={getCurrentFlag()} alt="flag" className="w-5 h-4 rounded-full" />
                      <span>Language ({selectedLanguage})</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            setSelectedLanguage(language.code)
                            setIsLanguageOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${selectedLanguage === language.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
                            }`}
                        >
                          <img src={language.flag} alt={`${language.name} flag`} className="w-5 h-4 rounded-full" />
                          <span>{language.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <button className="w-full flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span>Cart</span>
                </button>
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Sign In
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
