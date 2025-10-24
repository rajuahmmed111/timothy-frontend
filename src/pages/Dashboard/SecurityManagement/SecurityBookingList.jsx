import React from "react";
import { useState, useMemo } from "react";
import { Table, ConfigProvider, Modal, Button, Tag, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useGetSecurityBookingQuery } from "../../../redux/api/security/securityBookingApi";

const SecurityBookings = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  // Fetch all and handle pagination on frontend
  const { data, isLoading, isFetching, isError, error } = useGetSecurityBookingQuery({});
  console.log("data from security booking", data);

  const isNotFound = error?.status === 404;
  const bookings = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : isNotFound
    ? []
    : [];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return bookings;
    return bookings.filter((b) => {
      return (
        b.id?.toLowerCase().includes(term) ||
        b.checkoutSessionId?.toLowerCase().includes(term) ||
        b.bookingStatus?.toLowerCase().includes(term) ||
        String(b.number_of_security || "").toLowerCase().includes(term)
      );
    });
  }, [bookings, search]);

  const total = filtered.length;
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

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
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Session",
      dataIndex: "checkoutSessionId",
      key: "checkoutSessionId",
    },
    {
      title: "From",
      dataIndex: "securityBookedFromDate",
      key: "securityBookedFromDate",
    },
    {
      title: "To",
      dataIndex: "securityBookedToDate",
      key: "securityBookedToDate",
    },
    {
      title: "Qty",
      dataIndex: "number_of_security",
      key: "number_of_security",
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => {
        const colorMap = {
          PENDING: "orange",
          CANCELLED: "red",
          CONFIRMED: "green",
          COMPLETED: "green",
          PAID: "blue",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (amount) => (amount !== undefined ? `$${amount}` : "N/A"),
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
            placeholder="Search bookings"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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
        <Spin spinning={isLoading || isFetching}>
          <Table
            rowKey="id"
            dataSource={paginatedRows}
            columns={columns}
            locale={{ emptyText: isNotFound ? "No bookings found" : undefined }}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: false,
              showQuickJumper: false,
            }}
            onChange={(p) => {
              setPage(p.current || 1);
            }}
            loading={isLoading}
          />
        </Spin>
      </ConfigProvider>

      {isError && !isNotFound && (
        <div className="mt-4 text-red-600">Failed to load bookings.</div>
      )}

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
                <p className="text-gray-600">Session</p>
                <p className="font-medium">
                  {selectedBooking.checkoutSessionId}
                </p>
              </div>
              <div>
                <p className="text-gray-600">From</p>
                <p className="font-medium">
                  {selectedBooking.securityBookedFromDate}
                </p>
              </div>
              <div>
                <p className="text-gray-600">To</p>
                <p className="font-medium">
                  {selectedBooking.securityBookedToDate}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Quantity</p>
                <p className="font-medium">
                  {selectedBooking.number_of_security}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-medium">${selectedBooking.totalPrice}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <Tag
                  color={
                    {
                      PENDING: "orange",
                      CANCELLED: "red",
                      CONFIRMED: "green",
                      COMPLETED: "green",
                      PAID: "blue",
                    }[selectedBooking.bookingStatus] || "default"
                  }
                >
                  {selectedBooking.bookingStatus}
                </Tag>
              </div>
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-medium">{selectedBooking.category || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600">Created At</p>
                <p className="font-medium">{selectedBooking.createdAt}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SecurityBookings;
