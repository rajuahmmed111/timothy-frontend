import React, { useState } from "react";
import { Table, ConfigProvider, Tag, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Loader from "../../shared/Loader/Loader";
import { useGetSecurityBookingsQuery } from "../../redux/api/security/securityApi";
import SecurityBookingDetailsModal from "./SecurityBookingDetailsModal";

export default function SecurityBookings() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetSecurityBookingsQuery({});
  const bookings = data?.data || [];
  console.log("bookings of security", bookings);

  const dataSourceFull = bookings.map((booking) => ({
    id: booking?.id,
    bookedFromDate: booking?.securityBookedFromDate,
    bookedToDate: booking?.securityBookedToDate,
    numberOfSecurity: booking?.number_of_security,
    bookingStatus: booking?.bookingStatus,
    totalPrice: booking.totalPrice,
    category: booking.category,
    specialRequest: booking.specialRequest,
  }));

  // Client-side search
  const filtered = dataSourceFull.filter((b) => {
    const haystack = [
      b.id,
      b.category,
      b.bookedFromDate,
      b.bookedToDate,
      b.bookingStatus,
      String(b.totalPrice),
      b.specialRequest,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  // Client-side pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const pagedData = filtered.slice(start, end);
  const total = filtered.length;

  const showViewModal = (booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Check-in",
      dataIndex: "bookedFromDate",
      key: "bookedFromDate",
    },
    {
      title: "Check-out",
      dataIndex: "bookedToDate",
      key: "bookedToDate",
    },
    {
      title: "Security",
      dataIndex: "numberOfSecurity",
      key: "numberOfSecurity",
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => {
        const color =
          status === "CONFIRMED"
            ? "green"
            : status === "CANCELLED"
            ? "red"
            : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (amount) => `$${amount}`,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => showViewModal(record)} />
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="mb-5 flex justify-end items-center ">
        <div className="space-y-2 w-[400px]">
          <input
            type="text"
            placeholder="Search bookings"
            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
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
          rowKey="id"
          dataSource={pagedData}
          columns={columns}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: false,
            showQuickJumper: false,
          }}
          onChange={(pager) => {
            setPage(pager.current || 1);
            setLimit(pager.pageSize || 10);
          }}
        />
      </ConfigProvider>

      <SecurityBookingDetailsModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
}
