import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button } from "antd";
import { Eye, Trash } from "lucide-react";
import { useGetAvailableCarQuery, useDeleteCarMutation } from "../../redux/api/car/carApi";

export default function AvailableCarListing() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();

  const { data, isLoading } = useGetAvailableCarQuery({ page, limit: pageSize });

  const cars = data?.data?.data || data?.data || [];
  const meta = data?.data?.meta || data?.meta || {};
  const total = meta?.total ?? cars.length;

  const rows = cars.map((car, idx) => ({
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

  const filtered = search
    ? rows.filter((c) => {
        const q = search.toLowerCase();
        return (
          (c.name || "").toLowerCase().includes(q) ||
          (c.model || "").toLowerCase().includes(q) ||
          (c.location || "").toLowerCase().includes(q)
        );
      })
    : rows;

  // Handlers
  const showViewModal = (car) => {
    setSelectedCar(car);
    setIsViewModalOpen(true);
  };

  const showDeleteModal = (car) => {
    setSelectedCar(car);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    const id = selectedCar?.raw?.id || selectedCar?.id;
    if (!id) {
      setIsDeleteModalOpen(false);
      setSelectedCar(null);
      return;
    }
    try {
      await deleteCar(id).unwrap();
    } catch (e) {
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedCar(null);
    }
  };

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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          <Eye
            className="text-[#3b82f6] w-6 h-6 cursor-pointer"
            onClick={() => showViewModal(record)}
          />
          <Trash
            className="text-red-500 w-6 h-6 cursor-pointer"
            onClick={() => showDeleteModal(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-5">
      <div className="mb-5 flex justify-end items-center ">
        <div className="space-y-2 w-[400px]">
          <input
            type="text"
            placeholder="Search by type, model or location"
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
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: false,
          }}
          onChange={(p) => {
            setPage(p.current);
            setPageSize(p.pageSize);
          }}
        />
      </ConfigProvider>

      <Modal
        title="Car Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedCar && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <img
                src={
                  selectedCar.raw?.carImages?.[0] ||
                  selectedCar.carImages?.[0] ||
                  selectedCar.image
                }
                alt={selectedCar.name}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>

            <h3 className="text-lg font-bold">{selectedCar.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><span className="font-semibold">Model:</span> {selectedCar.raw?.carModel}</div>
              <div><span className="font-semibold">Seats:</span> {selectedCar.raw?.carSeats}</div>
              <div><span className="font-semibold">Oil:</span> {selectedCar.raw?.carOilType}</div>
              <div><span className="font-semibold">Engine:</span> {selectedCar.raw?.carEngineType}</div>
              <div><span className="font-semibold">Transmission:</span> {selectedCar.raw?.carTransmission}</div>
              <div><span className="font-semibold">Power:</span> {selectedCar.raw?.carPower}</div>
              <div><span className="font-semibold">Drivetrain:</span> {selectedCar.raw?.carDrivetrain}</div>
              <div><span className="font-semibold">Mileage:</span> {selectedCar.raw?.carMileage}</div>
              <div><span className="font-semibold">Capacity:</span> {selectedCar.raw?.carCapacity}</div>
              <div><span className="font-semibold">Color:</span> {selectedCar.raw?.carColor}</div>
              <div><span className="font-semibold">Fuel:</span> {selectedCar.raw?.fuelType}</div>
              <div><span className="font-semibold">Gear:</span> {selectedCar.raw?.gearType}</div>
              <div><span className="font-semibold">Rating:</span> {selectedCar.raw?.carRating ?? selectedCar.rating ?? "N/A"}</div>
              <div><span className="font-semibold">Price/Day:</span> ${selectedCar.raw?.carPriceDay ?? selectedCar.pricePerDay}</div>
              <div><span className="font-semibold">Category:</span> {selectedCar.raw?.category}</div>
              <div><span className="font-semibold">Discount:</span> {selectedCar.raw?.discount}</div>
              <div><span className="font-semibold">Status:</span> {selectedCar.raw?.isBooked ?? selectedCar.status}</div>
              <div><span className="font-semibold">Address:</span> {selectedCar.raw?.carAddress}</div>
              <div><span className="font-semibold">City:</span> {selectedCar.raw?.carCity}</div>
              <div><span className="font-semibold">Country:</span> {selectedCar.raw?.carCountry}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete} loading={isDeleting}>
            Delete
          </Button>,
        ]}
      >
        {selectedCar && (
          <p>
            Are you sure you want to delete <b>{selectedCar.name}</b>?
          </p>
        )}
      </Modal>
    </div>
  );
}