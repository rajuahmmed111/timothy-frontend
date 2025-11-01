import React, { useState } from "react";
import { Table, ConfigProvider, Tag } from "antd";
import { useGetAllActiveAttractionListingsQuery } from "../../redux/api/attraction/attractionApi";

export default function RecentAttractionListings() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetAllActiveAttractionListingsQuery({ 
    page, 
    limit: pageSize 
  });
  
  const attractions = data?.data?.data || [];

  const attractionsData = attractions?.slice(0, 5)?.map((attraction, idx) => ({
    ...attraction,
    key: attraction?.id || idx,
    image: attraction?.attractionImages?.[0] || "",
    name: attraction?.attractionDestinationType || "",
    location: [
      attraction?.attractionCity,
      attraction?.attractionDistrict,
      attraction?.attractionCountry
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

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) => index + 1,
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
        <Tag color={status === "AVAILABLE" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="p-5">
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
          dataSource={attractionsData}
          columns={columns}
          loading={isLoading}
          pagination={false}
        />
      </ConfigProvider>
    </div>
  );
}
