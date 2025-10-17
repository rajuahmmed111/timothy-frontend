import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button } from "antd";
import { Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";



export default function ListingsForHotel() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const navigate = useNavigate();

  const hotels = [
    {
      id: 1,
      name: "Azure Oasis",
      location: "Thailand",
      price: 580,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Mountain Escape",
      location: "Switzerland",
      price: 720,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Desert Pearl",
      location: "Dubai, UAE",
      price: 650,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Ocean Breeze Resort",
      location: "Maldives",
      price: 950,
      rating: 5.0,
      image:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "Forest Retreat",
      location: "Canada",
      price: 430,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 1,
      name: "Azure Oasis",
      location: "Thailand",
      price: 580,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Mountain Escape",
      location: "Switzerland",
      price: 720,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Desert Pearl",
      location: "Dubai, UAE",
      price: 650,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Ocean Breeze Resort",
      location: "Maldives",
      price: 950,
      rating: 5.0,
      image:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "Forest Retreat",
      location: "Canada",
      price: 430,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 1,
      name: "Azure Oasis",
      location: "Thailand",
      price: 580,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Mountain Escape",
      location: "Switzerland",
      price: 720,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Desert Pearl",
      location: "Dubai, UAE",
      price: 650,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Ocean Breeze Resort",
      location: "Maldives",
      price: 950,
      rating: 5.0,
      image:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "Forest Retreat",
      location: "Canada",
      price: 430,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    },
  ];


  // Open view modal
  const showViewModal = (hotel) => {
    setSelectedHotel(hotel);
    setIsViewModalOpen(true);
  };

  // Open delete modal
  const showDeleteModal = (hotel) => {
    setSelectedHotel(hotel);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleDelete = () => {
    console.log("Deleted:", selectedHotel);
    setIsDeleteModalOpen(false);
    setSelectedHotel(null);
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
        <img src={image} alt="Hotel" className="w-20 h-12 object-cover rounded-md" />
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
      render: (price) => `$${price}/night`,
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
        <div className="space-y-2 w-[400px] flex gap-2">
          <input
            type="text"
            placeholder="Search bookings"
            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
          />
          <Button
            type="primary"
            onClick={() => navigate("/dashboard/add-listing")}
            className="bg-blue-600 text-white !py-6  hover:bg-blue-700 p-3"
          >
            Add Listing
          </Button>
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
          dataSource={hotels}
          columns={columns}
          pagination={{ pageSize: 10 }}

        />
      </ConfigProvider>

      {/* View Modal */}
      <Modal
        title="Hotel Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedHotel && (
          <div className="space-y-3">
            <img
              src={selectedHotel.image}
              alt={selectedHotel.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-lg font-bold">{selectedHotel.name}</h3>
            <p>📍 {selectedHotel.location}</p>
            <p>⭐ {selectedHotel.rating}</p>
            <p className="font-semibold">${selectedHotel.price}/night</p>
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
        {selectedHotel && (
          <p>
            Are you sure you want to delete <b>{selectedHotel.name}</b>?
          </p>
        )}
      </Modal>
    </div>
  );
}
