import React from "react";
import {
  CheckCircle,
  Shield,
  Calendar,
  Clock,
  MapPin,
  Users,
  Phone,
  Mail,
  CreditCard,
  Star,
  User,
  DollarSign,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SecurityBookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get booking data from location state or use default values
  const booking = location.state?.bookingDetails || {
    bookingId: "SEC" + Math.floor(10000000 + Math.random() * 90000000),
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    serviceType: "Personal Security",
    total: 500,
    serviceDescription: "Dedicated protection for individuals",
    paymentStatus: "completed",
    paymentDate: new Date().toISOString(),
    paymentMethod: "•••• •••• •••• 4242",
  };

  // Security service details
  const securityDetails = {
    serviceName: "Elite Security Services",
    provider: "SecureGuard Professional",
    rating: 4.9,
    location: "Metropolitan Area Coverage",
    description: "Professional security services with highly trained personnel",
    serviceFeatures: [
      "24/7 Professional Security Personnel",
      "Advanced Surveillance Equipment",
      "Emergency Response Protocol",
      "Real-time Communication System",
      "Incident Reporting & Documentation",
      "Crowd Control Management",
      "Access Control Systems",
      "Mobile Patrol Services",
    ],
    reviews: [
      {
        name: "Robert Anderson",
        date: "March 2024",
        comment:
          "Exceptional security service with professional staff. Highly recommend for any security needs.",
      },
      {
        name: "Lisa Thompson",
        date: "February 2024",
        comment:
          "Outstanding service quality and very responsive team. Made us feel completely secure.",
      },
      {
        name: "David Wilson",
        date: "January 2024",
        comment:
          "Professional, reliable, and efficient security services. Great value for money.",
      },
    ],
  };

  // Client details
  const clientDetails = {
    primaryClient: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      total: "500",
    },
    specialRequests: "Additional patrol during evening hours",
    additionalNotes: "VIP protection required for special event",
    emergencyContact: {
      name: "Jane Smith",
      phone: "+1 (555) 987-6543",
    },
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDays = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen py-12 px-5 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-blue-100">
              Your booking ID: {booking.bookingId}
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Security Service Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Security Service Details
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {securityDetails.serviceName}
                    </h3>
                    <p className="text-gray-600">{securityDetails.provider}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(securityDetails.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {securityDetails.rating}/5
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {securityDetails.location}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {securityDetails.description}
                </p>
              </div>
            </div>

            {/* Booking Information */}
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Service Period</p>
                      <p className="font-medium">
                        {formatDate(booking.startDate)} -{" "}
                        {formatDate(booking.endDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {calculateDays(booking.startDate, booking.endDate)} day
                        {calculateDays(booking.startDate, booking.endDate) > 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Service Type</p>
                      <p className="font-medium">{booking.serviceType}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium">24/7 Service</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Service Coverage</p>
                      <p className="font-medium">Professional Security Team</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-medium">${clientDetails.primaryClient.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Client Information */}
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Primary Client</p>
                      <p className="font-medium">
                        {clientDetails.primaryClient.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">
                        {clientDetails.primaryClient.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {clientDetails.primaryClient.phone}
                      </p>
                    </div>
                  
                  </div>
                </div>

              </div>
            </div>

          
          </div>

          <div className="space-y-3 mt-5 px-6 pb-6">
            <div className="w-full">
              <Link
                to="/"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
              >
                Back to Home
              </Link>
            </div>
            <button
              type="button"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
              onClick={() => window.print()}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
