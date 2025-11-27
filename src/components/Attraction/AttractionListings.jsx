import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button, Tag } from "antd";
import { Eye } from "lucide-react";
import { useGetAllActiveAttractionListingsQuery } from "../../redux/api/attraction/attractionApi";
import { useNavigate } from "react-router-dom";

export default function AttractionListings() {
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = useGetAllActiveAttractionListingsQuery({
    page,
    limit: pageSize,
  });
  
  const attractions = data?.data?.data || [];
  console.log("data,", attractions);
  const meta = data?.data?.meta || {};
  const total = meta?.total ?? attractions.length;

  const attractionsData = attractions.map((attraction, idx) => ({
    ...attraction,
    key: attraction?.id || idx,
    image: attraction?.attractionImages?.[0] || "",
    name: attraction?.attractionDestinationType || "",
    location: [
      attraction?.attractionCity,
      attraction?.attractionDistrict,
      attraction?.attractionCountry,
    ]
      .filter(Boolean)
      .join(", "),
    adultPrice: attraction?.attractionAdultPrice || 0,
    childPrice: attraction?.attractionChildPrice || 0,
    rating: attraction?.attractionRating || null,
    status: attraction?.isBooked || "N/A",
    category: attraction?.category || "N/A",
    raw: attraction,
  }));

  // Open view modal
  const showViewModal = (attraction) => {
    setSelectedAttraction(attraction);
    setIsViewModalOpen(true);
  };

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image || "/placeholder.jpg"}
          alt="Attraction"
          className="w-20 h-12 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Adult Price",
      dataIndex: "adultPrice",
      key: "adultPrice",
      render: (price) => `৳${price}`,
    },
    {
      title: "Child Price",
      dataIndex: "childPrice",
      key: "childPrice",
      render: (price) => `৳${price}`,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (rating ? `⭐ ${rating}` : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "AVAILABLE" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          <Eye
            className="text-[#3b82f6] w-6 h-6 cursor-pointer"
            onClick={() => showViewModal(record)}
          />
        </div>
      ),
    },
  ];

  const filtered = search
    ? attractionsData.filter((a) => {
        const q = search.toLowerCase();
        return (
          (a.name || "").toLowerCase().includes(q) ||
          (a.category || "").toLowerCase().includes(q) ||
          (a.location || "").toLowerCase().includes(q)
        );
      })
    : attractionsData;

  return (
    <div className="p-5">
      <div className="mb-5 flex justify-end items-center">
        <div className="space-y-2 flex justify-center gap-2 w-[400px]">
          <input
            type="text"
            placeholder="Search attraction by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
          />

          <Button
            type="primary"
            onClick={() => navigate("/dashboard/add-attraction")}
            className="bg-blue-600 text-white !py-6 hover:bg-blue-700 p-3"
          >
            Add Attraction
          </Button>
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#3b82f6",
              headerColor: "white",
              cellFontSize: 16,
            },
            Pagination: {
              colorPrimary: "#3b82f6",
            },
          },
        }}
      >
        <Table
          rowKey="key"
          dataSource={filtered}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: false,
          }}
          onChange={(p) => {
            setPage(p.current);
            setPageSize(p.pageSize);
          }}
        />
      </ConfigProvider>

      {/* View Modal */}
      <Modal
        title="Attraction Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedAttraction && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {selectedAttraction.raw?.attractionImages?.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedAttraction.raw.attractionImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Attraction ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold">
              {selectedAttraction.raw?.attractionDestinationType}
            </h3>

            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                {selectedAttraction.raw?.attractionDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold">Category:</span>{" "}
                {selectedAttraction.raw?.category}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <Tag
                  color={
                    selectedAttraction.raw?.isBooked === "AVAILABLE"
                      ? "green"
                      : "red"
                  }
                >
                  {selectedAttraction.raw?.isBooked}
                </Tag>
              </div>
              <div>
                <span className="font-semibold">Adult Price:</span> ৳
                {selectedAttraction.raw?.attractionAdultPrice}
              </div>
              <div>
                <span className="font-semibold">Child Price:</span> ৳
                {selectedAttraction.raw?.attractionChildPrice}
              </div>
              <div>
                <span className="font-semibold">Rating:</span>{" "}
                {selectedAttraction.raw?.attractionRating
                  ? `⭐ ${selectedAttraction.raw?.attractionRating}`
                  : "N/A"}
              </div>
              <div>
                <span className="font-semibold">Review Count:</span>{" "}
                {selectedAttraction.raw?.attractionReviewCount || 0}
              </div>
              <div>
                <span className="font-semibold">Discount:</span>{" "}
                {selectedAttraction.raw?.discount}%
              </div>
              <div>
                <span className="font-semibold">VAT:</span>{" "}
                {selectedAttraction.raw?.vat}%
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold mb-2">Location Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  {selectedAttraction.raw?.attractionAddress}
                </div>
                <div>
                  <span className="font-semibold">City:</span>{" "}
                  {selectedAttraction.raw?.attractionCity}
                </div>
                <div>
                  <span className="font-semibold">District:</span>{" "}
                  {selectedAttraction.raw?.attractionDistrict}
                </div>
                <div>
                  <span className="font-semibold">Postal Code:</span>{" "}
                  {selectedAttraction.raw?.attractionPostalCode}
                </div>
                <div>
                  <span className="font-semibold">Country:</span>{" "}
                  {selectedAttraction.raw?.attractionCountry}
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold mb-2">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      selectedAttraction.raw?.attractionFreeWifi
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {selectedAttraction.raw?.attractionFreeWifi ? "✓" : "✗"}
                  </span>
                  <span>Free WiFi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      selectedAttraction.raw?.attractionFreeParking
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {selectedAttraction.raw?.attractionFreeParking ? "✓" : "✗"}
                  </span>
                  <span>Free Parking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      selectedAttraction.raw?.attractionKitchen
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {selectedAttraction.raw?.attractionKitchen ? "✓" : "✗"}
                  </span>
                  <span>Kitchen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      selectedAttraction.raw?.attractionTv
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {selectedAttraction.raw?.attractionTv ? "✓" : "✗"}
                  </span>
                  <span>TV</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      selectedAttraction.raw?.attractionAirConditioning
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {selectedAttraction.raw?.attractionAirConditioning
                      ? "✓"
                      : "✗"}
                  </span>
                  <span>Air Conditioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      selectedAttraction.raw?.attractionPool
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {selectedAttraction.raw?.attractionPool ? "✓" : "✗"}
                  </span>
                  <span>Pool</span>
                </div>
              </div>
            </div>

            {selectedAttraction.raw?.attractionServicesOffered?.length > 0 && (
              <div className="border-t pt-3">
                <h4 className="font-semibold mb-2">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAttraction.raw.attractionServicesOffered.map(
                    (service, idx) => (
                      <Tag key={idx} color="blue">
                        {service}
                      </Tag>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-3 text-xs text-gray-500">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(
                    selectedAttraction.raw?.createdAt
                  ).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Updated:</span>{" "}
                  {new Date(
                    selectedAttraction.raw?.updatedAt
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
