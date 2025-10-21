import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button, Input, Space, Tag } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useGetHotelBookingsQuery } from "../../redux/api/hotel/hotelApi";

const { Search } = Input;

export default function HotelBookings() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data, isLoading, error } = useGetHotelBookingsQuery({});
  const bookings = data?.data || [];
  console.log("bookings", bookings);

  const dataSource = bookings.map((booking) => ({
    id: booking?.id,
    bookedFromDate: booking?.bookedFromDate,
    bookedToDate: booking?.bookedToDate,
    rooms: booking?.rooms,
    // adults: booking?.adults,
    // children: booking?.children,
    bookingStatus: booking?.bookingStatus,
    totalPrice: booking.totalPrice,
    category: booking.category,
    specialRequest: booking.specialRequest,
  }));

  const showViewModal = (booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) => index + 1,
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
      title: "Rooms",
      dataIndex: "rooms",
      key: "rooms",
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
    return (
      <div className="p-6">
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load bookings.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-5 flex justify-end items-center ">
        <div className="space-y-2 w-[400px]">
          <input
            type="text"
            placeholder="Search bookings"
            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
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
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </ConfigProvider>

      {/* View Modal */}
      <Modal
        title="Booking Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Booking ID</p>
                <p className="font-medium">{selectedBooking.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <Tag
                  color={
                    selectedBooking.bookingStatus === "CONFIRMED"
                      ? "green"
                      : selectedBooking.bookingStatus === "CANCELLED"
                      ? "red"
                      : "orange"
                  }
                >
                  {selectedBooking.bookingStatus}
                </Tag>
              </div>
              <div>
                <p className="text-gray-600">From</p>
                <p className="font-medium">{selectedBooking.bookedFromDate}</p>
              </div>
              <div>
                <p className="text-gray-600">To</p>
                <p className="font-medium">{selectedBooking.bookedToDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Rooms</p>
                <p className="font-medium">{selectedBooking.rooms}</p>
              </div>
              <div>
                <p className="text-gray-600">Adults / Children</p>
                <p className="font-medium">
                  {selectedBooking.adults} / {selectedBooking.children}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Price</p>
                <p className="font-medium">${selectedBooking.totalPrice}</p>
              </div>
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-medium">{selectedBooking.category}</p>
              </div>
              {selectedBooking.specialRequest && (
                <div className="col-span-2">
                  <p className="text-gray-600">Special Request</p>
                  <p className="font-medium">
                    {selectedBooking.specialRequest}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
