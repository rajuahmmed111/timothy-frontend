import React, { useState } from "react";
import { Table, ConfigProvider } from "antd";
import { useGetAllCarQuery } from "../../redux/api/car/carApi";

export default function RecentCarListings() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetAllCarQuery({ page, limit: pageSize });
  const cars = data?.data?.data || data?.data || [];

  const carsData = cars?.slice(0, 5)?.map((car, idx) => ({
    ...car,
    key: car?.id || car?._id || idx,
    image: car?.carImages?.[0] || car?.image,
    name: car?.carType || car?.name,
    model: car?.carModel || car?.model,
    location: [car?.carCity || car?.city, car?.carCountry || car?.country]
      .filter(Boolean)
      .join(", "),
    pricePerDay: car?.carPriceDay || car?.pricePerDay || car?.price || 0,
    rating: car?.carRating || car?.rating || null,
    status: car?.isBooked ?? car?.status,
    raw: car,
    seats: car?.carSeats || car?.seats,
    oilType: car?.carOilType || car?.oilType,
    engineType: car?.carEngineType || car?.engineType,
    transmission: car?.carTransmission || car?.transmission,
    power: car?.carPower || car?.power,
    drivetrain: car?.carDrivetrain || car?.drivetrain,
    mileage: car?.carMileage || car?.mileage,
    capacity: car?.carCapacity || car?.capacity,
    color: car?.carColor || car?.color,
    fuelType: car?.fuelType || car?.fuelType,
    gearType: car?.gearType || car?.gearType,
    reviewCount: car?.carReviewCount || car?.reviewCount,
    partnerId: car?.partnerId || car?.partnerId,
    rentalId: car?.car_RentalId || car?.rentalId,
    createdAt: car?.createdAt || car?.createdAt,
    updatedAt: car?.updatedAt || car?.updatedAt,
  }));

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
          src={image}
          alt="Car"
          className="w-20 h-12 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      key: "seats",
    },
    {
      title: "Oil Type",
      dataIndex: "oilType",
      key: "oilType",
    },
    {
      title: "Engine Type",
      dataIndex: "engineType",
      key: "engineType",
    },
    {
      title: "Transmission",
      dataIndex: "transmission",
      key: "transmission",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Price",
      dataIndex: "pricePerDay",
      key: "pricePerDay",
      render: (pricePerDay) => `$${pricePerDay}/day`,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (rating ? `⭐ ${rating}` : "N/A"),
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
          dataSource={carsData}
          columns={columns}
          loading={isLoading}
          pagination={false}
        />
      </ConfigProvider>
    </div>
  );
}
