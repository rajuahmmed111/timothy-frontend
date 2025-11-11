import React, { useMemo } from "react";
import { Table, Tag } from "antd";
import { useGetAllSecurityBookingQuery } from "../../../../redux/api/userDashboard/myBooking";

export default function SecurityBookings() {
  const { data, isLoading, isError } = useGetAllSecurityBookingQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );


  console.log("data: data of security", data);

  const bookingData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((booking, index) => ({
      no: index + 1,
      id: booking?.id,
      service: booking?.security?.securityName,
      location: booking?.security_Guard?.securityAddress,
      startDate: booking?.securityBookedFromDate,
      endDate: booking?.securityBookedToDate,
      securityCount: booking?.number_of_security,
      amount: booking?.totalPrice,
      bookingStatus: booking?.bookingStatus,
      paymentStatus: booking?.payment?.[0]?.status,
      paymentMethod: booking?.payment?.[0]?.provider,
    }));
  }, [data]);

  const columns = [
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Number of Security",
      dataIndex: "securityCount",
      key: "securityCount",
    },
    { title: "Amount", dataIndex: "amount", key: "amount" },
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
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button
        
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

  if (isLoading) return <div>Loading security bookings...</div>;
  if (isError) return <div>Error loading security bookings</div>;

  return (
    <Table
      dataSource={bookingData}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}
