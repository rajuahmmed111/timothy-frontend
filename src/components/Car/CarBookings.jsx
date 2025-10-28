import React, { useMemo, useState } from "react";
import { Table, ConfigProvider, Modal, Button, Input, Space, Tag } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useGetCarBookingsQuery } from "../../redux/api/car/carApi";

const { Search } = Input;

const CarBookings = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetCarBookingsQuery();

  const bookings = data?.data || [];

  const rows = useMemo(
    () =>
      bookings.map((b, idx) => ({
        key: b?.id || idx,
        id: b?.id,
        name: b?.user?.fullName || "-",
        email: b?.user?.email || "-",
        phone: b?.user?.contactNumber || "-",
        carModel: b?.car_Rental?.carName || "-",
        pickupDate: b?.carBookedFromDate,
        returnDate: b?.carBookedToDate,
        status: b?.bookingStatus,
        amount: b?.totalPrice,
        raw: b,
      })),
    [bookings]
  );

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        (r.bookingId || "").toLowerCase().includes(q) ||
        (r.customer || "").toLowerCase().includes(q) ||
        (r.carModel || "").toLowerCase().includes(q)
    );
  }, [rows, search]);

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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Car Model",
      dataIndex: "carModel",
      key: "carModel",
    },
    {
      title: "Pickup Date",
      dataIndex: "pickupDate",
      key: "pickupDate",
    },
    {
      title: "Return Date",
      dataIndex: "returnDate",
      key: "returnDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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

  return (
    <div className="p-6">
      <div className="mb-5 flex justify-end items-center ">
        <div className="space-y-2 w-[400px]">
          <input
            type="text"
            placeholder="Search by booking ID, customer or car name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          rowKey="key"
          dataSource={filtered}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </ConfigProvider>

      {/* View Modal */}
      <Modal
        title="Car Rental Booking Details"
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
                <p className="text-gray-600">Customer</p>
                <p className="font-medium">{selectedBooking.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Car Name</p>
                <p className="font-medium">{selectedBooking.carModel}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <Tag
                  color={
                    selectedBooking.status === "CONFIRMED"
                      ? "green"
                      : selectedBooking.status === "CANCELLED"
                      ? "red"
                      : "orange"
                  }
                >
                  {selectedBooking.status}
                </Tag>
              </div>
              <div>
                <p className="text-gray-600">Pickup Date</p>
                <p className="font-medium">{selectedBooking.pickupDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Return Date</p>
                <p className="font-medium">{selectedBooking.returnDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-medium">${selectedBooking.amount}</p>
              </div>
              <div>
                <p className="text-gray-600">Daily Price</p>
                <p className="font-medium">
                  ${selectedBooking.raw?.car?.carPriceDay}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-medium">{selectedBooking.raw?.category}</p>
              </div>
             
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CarBookings;
