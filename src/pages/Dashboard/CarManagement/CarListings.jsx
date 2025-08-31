import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button } from "antd";
import { Eye, Trash } from "lucide-react";



export default function CarListings() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const cars = [
    {
      id: 1,
      name: "Toyota Camry",
      location: "Dubai, UAE",
      price: 85,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "BMW X5",
      location: "Abu Dhabi, UAE",
      price: 150,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Mercedes-Benz S-Class",
      location: "Sharjah, UAE",
      price: 200,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Lamborghini Huracan",
      location: "Dubai, UAE",
      price: 500,
      rating: 5.0,
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "Tesla Model 3",
      location: "Dubai, UAE",
      price: 120,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      name: "Audi A4",
      location: "Ajman, UAE",
      price: 110,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1606016159991-8b61b1c5a5b6?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 7,
      name: "Honda Civic",
      location: "Fujairah, UAE",
      price: 70,
      rating: 4.3,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 8,
      name: "Nissan Sentra",
      location: "Ras Al Khaimah, UAE",
      price: 65,
      rating: 4.2,
      image:
        "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 9,
      name: "Ford Explorer",
      location: "Dubai, UAE",
      price: 130,
      rating: 4.4,
      image:
        "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 10,
      name: "Porsche 911",
      location: "Dubai, UAE",
      price: 450,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    },
  ];


  // Open view modal
  const showViewModal = (car) => {
    setSelectedCar(car);
    setIsViewModalOpen(true);
  };

  // Open delete modal
  const showDeleteModal = (car) => {
    setSelectedCar(car);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleDelete = () => {
    console.log("Deleted:", selectedCar);
    setIsDeleteModalOpen(false);
    setSelectedCar(null);
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
        <img src={image} alt="Car" className="w-20 h-12 object-cover rounded-md" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}/day`,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => `⭐ ${rating}`,
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
            placeholder="Search cars"
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
          dataSource={cars}
          columns={columns}
          pagination={{ pageSize: 10 }}

        />
      </ConfigProvider>

      {/* View Modal */}
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
          <div className="space-y-3">
            <img
              src={selectedCar.image}
              alt={selectedCar.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-lg font-bold">{selectedCar.name}</h3>
            <p>📍 {selectedCar.location}</p>
            <p>⭐ {selectedCar.rating}</p>
            <p className="font-semibold">${selectedCar.price}/day</p>
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
          <Button key="delete" type="primary" danger onClick={handleDelete}>
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
