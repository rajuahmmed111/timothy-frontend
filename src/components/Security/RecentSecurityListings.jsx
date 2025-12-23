import React from "react";
import { Table, ConfigProvider, Tag } from "antd";
import Loader from "../../shared/Loader/Loader";
import { useGetAllSecurityQuery } from "../../redux/api/security/securityApi";

export default function RecentSecurityListings() {
  const { data, isLoading } = useGetAllSecurityQuery({ page: 1, limit: 5 });
  const securityListings = data?.data?.data || [];

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <img
          src={
            record.securityImages?.[0] || "https://via.placeholder.com/80x60"
          }
          alt="Security"
          className="w-20 h-12 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "securityGuardName",
      key: "securityGuardName",
    },
    {
      title: "Location",
      key: "location",
      render: (_, r) => `${r.securityCity}, ${r.securityCountry}`,
    },
    {
      title: "Price/Day",
      key: "price",
      render: (_, r) => `$${r.securityPriceDay}`,
    },
    {
      title: "Rating",
      key: "rating",
      render: (_, r) => `⭐ ${r.securityRating || "N/A"}`,
    },
    {
      title: "Hired",
      key: "hiredCount",
      dataIndex: "hiredCount",
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={r.isBooked === "AVAILABLE" ? "green" : "red"}>
          {r.isBooked}
        </Tag>
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-5">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Security Listings</h2>
      </div>
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#3b82f6",
            },
            Table: {
              headerBg: "#3b82f6",
              headerColor: "rgb(255,255,255)",
              cellFontSize: 16,
              headerSplitColor: "#3b82f6",
            },
          },
        }}
      >
        <Table
          rowKey={(r) => r.id || r._id}
          dataSource={securityListings}
          columns={columns}
          pagination={false}
          loading={isLoading}
        />
      </ConfigProvider>
    </div>
  );
}
