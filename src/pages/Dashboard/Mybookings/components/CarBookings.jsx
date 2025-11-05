import React from "react";
import { Table, Tag } from "antd";
import { useGetAllCarBookingQuery } from "../../../../redux/api/userDashboard/myBooking";
import Loader from "../../../../shared/Loader/Loader";

export default function CarBookings() {
  const { data: carBooking, isLoading } = useGetAllCarBookingQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const bookingData = React.useMemo(() => {
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
    }));
  }, [carBooking]);

  if (isLoading) return <Loader />;

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    {
      title: "Car Image",
      dataIndex: "carImage",
      key: "carImage",
      render: (text, record) => <img src={record.carImage} alt="car" />,
    },
    { title: "Car Model", dataIndex: "carModel", key: "carModel" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    { title: "Passengers", dataIndex: "carSeats", key: "passengers" },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.status === "confirmed" ? "green" : "orange"}>
          {record.status || "pending"}
        </Tag>
      ),
    },
    { title: "Amount", dataIndex: "totalPrice", key: "amount" },
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
