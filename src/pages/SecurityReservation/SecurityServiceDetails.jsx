import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SecurityBookingForm from "./SecurityBookingForm";
import { Spin } from "antd";
import { useGetSecurityProtocolByIdQuery } from "../../redux/api/security/securityApi";

export default function SecurityServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const locationRouter = useLocation();
  const sp = new URLSearchParams(locationRouter.search);
  const fromDateQuery = sp.get('fromDate') || '';
  const toDateQuery = sp.get('toDate') || '';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data, isLoading, isFetching, isError } = useGetSecurityProtocolByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const guard = useMemo(() => data?.data || data, [data]);
  const service = useMemo(() => {
    const imageList = Array.isArray(guard?.securityImages) && guard.securityImages.length > 0
      ? guard.securityImages
      : [guard?.businessLogo].filter(Boolean);
    const images = imageList.length > 0 ? imageList : ["/SecurityProviders/1.png"];
    return {
      id: guard?.id || guard?._id || id,
      name: guard?.securityGuardName || guard?.securityName || guard?.securityBusinessName || "",
      location: [guard?.securityCity, guard?.securityCountry].filter(Boolean).join(", "),
      images,
      price: guard?.securityPriceDay || 0,
      rating: Number(guard?.securityRating) || 0,
      description: guard?.securityGuardDescription || guard?.securityProtocolDescription || "",
      services: Array.isArray(guard?.securityServicesOffered) ? guard.securityServicesOffered : [],
      experience: guard?.experience != null ? `${guard.experience}+ years` : "",
      languages: Array.isArray(guard?.languages) ? guard.languages : [],
      availability: guard?.availability || "",
      certification: guard?.certification || "",
    };
  }, [guard, id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + service.images.length) % service.images.length
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Reset image index when navigating to a new guard id
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [id]);

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // If fetching failed or no guard returned, it's likely a protocol ID.
  if (isError || !guard) {
    navigate(`/security-protocol-details/${id}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="md:flex">
              {/* Left Column - Service Details */}
              <div className="p-6 md:p-8 md:w-2/3">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {service.name}
                  </h1>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-1 text-sky-600" />
                  <span>{service.location}</span>
                </div>

                {/* Image Gallery */}
                <div className="mb-8">
                  {/* Main Image Display */}
                  <div className="relative mb-4 rounded-lg overflow-hidden">
                    <img
                      src={service.images[currentImageIndex]}
                      alt={`${service.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-96 object-cover rounded-lg"
                    />

                    {/* Navigation Arrows */}
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {service.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-6 gap-2">
                    {service.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`relative rounded-lg overflow-hidden aspect-square ${
                          currentImageIndex === index
                            ? "ring-2 ring-sky-500"
                            : "hover:opacity-80"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${service.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {currentImageIndex === index && (
                          <div className="absolute inset-0 bg-sky-500 bg-opacity-20"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">
                    About This Service
                  </h2>
                  <p className="text-gray-700 mb-6">{service.description}</p>

                  <h2 className="text-xl font-semibold mb-3">
                    Services Provided
                  </h2>
                  <div className="grid grid-cols-1 gap-2 mb-6">
                    {service.services.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                      Additional Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium">{guard?.experience} years</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Availability</p>
                          <p className="font-medium">{guard?.availability}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Languages</p>
                          <p className="font-medium">
                            {(Array.isArray(guard?.languages) ? guard.languages : []).join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Certification</p>
                          <p className="font-medium">{guard?.certification}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Form */}
              <div className="p-6 md:p-8 md:w-1/3 bg-gray-50 border-l border-gray-200">
                <SecurityBookingForm
                  guardId={service.id}
                  guardName={service.name}
                  pricePerDay={service.price}
                  photo={service.images?.[0]}
                  fromDate={fromDateQuery}
                  toDate={toDateQuery}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
