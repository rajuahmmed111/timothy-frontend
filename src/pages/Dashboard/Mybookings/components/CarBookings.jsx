import React, { useMemo, useState } from "react";
import { Table, Tag } from "antd";
import { useGetAllCarBookingQuery } from "../../../../redux/api/userDashboard/myBooking";
import Loader from "../../../../shared/Loader/Loader";

export default function CarBookings() {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async (id) => {
    try {
      setIsCancelling(true);
      // TODO: Wire cancel API when available
    } finally {
      setIsCancelling(false);
    }
  };
  const { data: carBooking, isLoading } = useGetAllCarBookingQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const bookingData = useMemo(() => {
    if (!carBooking?.data) return [];
    return carBooking.data.map((booking, index) => ({
      no: index + 1,
      id: booking?.id,
      carModel: booking?.car?.carModel,
      carImage: booking?.car?.carImage,
      carSeats: booking?.car?.carSeats,
      startDate: booking?.carBookedFromDate,
      endDate: booking?.carBookedToDate,
      status: booking?.bookingStatus,
      totalPrice: booking?.totalPrice,
      bookingStatus: booking?.bookingStatus,
      paymentStatus: booking?.payment?.[0]?.status,
      paymentMethod: booking?.payment?.[0]?.provider,
    }));
  }, [carBooking]);

  if (isLoading) return <Loader />;

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    { title: "Car Model", dataIndex: "carModel", key: "carModel" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    { title: "Passengers", dataIndex: "carSeats", key: "passengers" },
    { title: "Amount", dataIndex: "totalPrice", key: "amount" },
    {
      title: "Booking Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (_, record) => (
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold inline-block ${
            record?.bookingStatus === "CONFIRMED"
              ? "bg-green-100 text-green-700"
              : record?.bookingStatus === "CANCELLED"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {record?.bookingStatus ?? "PENDING"}
        </span>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (_, record) => (
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold inline-block ${
            record?.paymentStatus === "PAID"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {record?.paymentStatus ?? "UNPAID"}
        </span>
      ),
    },
    { title: "Payment Method", dataIndex: "paymentMethod", key: "paymentMethod" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleCancel(record?.id)}
          disabled={isCancelling || record?.bookingStatus === "CANCELLED"}
          className={`text-xs px-3 py-1 rounded border transition ${
            record?.bookingStatus === "CANCELLED"
              ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          }`}
        >
          Cancel
        </button>
      ),
    },
  ];

  return (
    <Table
      dataSource={bookingData}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}
