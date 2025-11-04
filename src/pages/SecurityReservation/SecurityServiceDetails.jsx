import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Shield,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";
import SecurityBookingForm from "./SecurityBookingForm";
import { Spin } from "antd";
import {
  useGetSecurityProtocolByIdQuery,
  useGetAllSecurityProtocolsQuery,
} from "../../redux/api/security/securityApi";
import ImageGallery from "./ImageGallery";

export default function SecurityServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const locationRouter = useLocation();
  const sp = new URLSearchParams(locationRouter.search);
  const fromDateQuery = sp.get("fromDate") || "";
  const toDateQuery = sp.get("toDate") || "";
  const selectedGuardFromState = locationRouter.state?.selectedGuard || null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data, isLoading, isFetching, isError } =
    useGetSecurityProtocolByIdQuery(id, {
      refetchOnMountOrArgChange: true,
    });
  console.log("asdfads", data);

  const guard = useMemo(() => data?.data || data, [data]);
  const service = useMemo(() => {
    const imageList =
      Array.isArray(guard?.securityImages) && guard.securityImages.length > 0
        ? guard.securityImages
        : [guard?.businessLogo].filter(Boolean);
    const images =
      imageList.length > 0 ? imageList : ["/SecurityProviders/1.png"];
    return {
      id: guard?.id || guard?._id || id,
      name:
        guard?.securityGuardName ||
        guard?.securityName ||
        guard?.securityBusinessName ||
        "",
      location: [guard?.securityCity, guard?.securityCountry]
        .filter(Boolean)
        .join(", "),
      images,
      price: guard?.securityPriceDay || 0,
      rating: Number(guard?.securityRating) || 0,
      description:
        guard?.securityGuardDescription ||
        guard?.securityProtocolDescription ||
        "",
      services: Array.isArray(guard?.securityServicesOffered)
        ? guard.securityServicesOffered
        : [],
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

  if (!selectedGuardFromState && (isLoading || isFetching)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // If fetching failed or no guard returned, it's likely a protocol ID.
  if (!selectedGuardFromState && (isError || !guard)) {
    navigate(`/security-protocol-details/${id}`);
    return null;
  }

  // If a guard was selected from the grid, show its details + booking form
  if (selectedGuardFromState) {
    const g = selectedGuardFromState;
    const images = Array.isArray(g?.securityImages) && g.securityImages.length > 0
      ? g.securityImages
      : ["/SecurityProviders/1.png"];
    
    // Prepare images for the gallery
    const galleryImages = [
      g?.businessLogo ? g.businessLogo : null,
      ...(Array.isArray(images) ? images : [])
    ].filter(Boolean);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="md:flex">
              {/* Left: Guard Details */}
              <div className="p-6 md:p-8 md:w-2/3">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{g?.securityGuardName}</h1>
                </div>
                  <div className="flex items-center">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                <div className="flex items-center mt-2 text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-1 text-sky-600" />
                  <span>{[g?.securityCity, g?.securityCountry].filter(Boolean).join(', ')}</span>
                </div>
                {/* Image Gallery */}
                <div className="mb-6">
                  <ImageGallery 
                    images={galleryImages} 
                    alt={g?.securityGuardName || 'Security Guard'} 
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">About</h2>
                  <p className="text-gray-700">{g?.securityGuardDescription}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-sky-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium">{g?.experience} years</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-sky-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Availability</p>
                        <p className="font-medium">{g?.availability}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-sky-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Languages</p>
                        <p className="font-medium">{(Array.isArray(g?.languages)?g.languages:[]).join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-sky-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Certification</p>
                        <p className="font-medium">{g?.certification}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Booking Form */}
              <div className="p-6 md:p-8 md:w-1/3 bg-gray-50 border-l border-gray-200">
                <SecurityBookingForm
                  guardId={g?.id || g?._id}
                  guardName={g?.securityGuardName}
                  pricePerDay={Number(g?.securityPriceDay) || 0}
                  photo={(Array.isArray(g?.securityImages) && g.securityImages[0]) || undefined}
                  fromDate={fromDateQuery}
                  toDate={toDateQuery}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: show only Available Guards grid
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProtocolGuardsSection protocolId={id} fromDate={fromDateQuery} toDate={toDateQuery} />
      </div>
    </div>
  );
}

function ProtocolGuardsSection({ protocolId, fromDate, toDate }) {
  const { data: protocolsResp, isFetching } = useGetAllSecurityProtocolsQuery();
  const protocols = React.useMemo(
    () =>
      protocolsResp?.data?.data || protocolsResp?.data || protocolsResp || [],
    [protocolsResp]
  );
  const current = React.useMemo(
    () =>
      (Array.isArray(protocols) ? protocols : []).find(
        (p) => (p?.id || p?._id) === protocolId
      ),
    [protocols, protocolId]
  );
  const guards = Array.isArray(current?.security_Guard)
    ? current.security_Guard
    : [];
  const navigate = useNavigate();

  const handleGuardClick = (guard) => {
    navigate(`/security-service-details/${protocolId}`, {
      state: { selectedGuard: guard },
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Available Guards
      </h2>
      {isFetching ? (
        <div className="flex items-center justify-center py-6">
          <Spin />
        </div>
      ) : guards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guards.map((g) => (
            <button
              key={g?.id || g?._id}
              onClick={() => handleGuardClick(g)}
              className="text-left bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <img
                src={
                  (Array.isArray(g?.securityImages) && g.securityImages[0]) ||
                  "/placeholder.svg"
                }
                alt={g?.securityGuardName}
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <div className="font-semibold text-gray-900">
                  {g?.securityGuardName}
                </div>
                <div className="text-sm text-gray-600">
                  {[g?.securityCity, g?.securityCountry]
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <div className="mt-1 text-sm">
                  <span className="font-medium">
                    ${g?.securityPriceDay || 0}
                  </span>{" "}
                  / day
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {g?.availability}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
          No guards available for this protocol.
        </div>
      )}
    </div>
  );
}
