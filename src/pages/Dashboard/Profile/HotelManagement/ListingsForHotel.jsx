import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button, Spin, message } from "antd";
import { Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetHotelRoomsQuery } from '../../../../redux/api/hotel/getHoterRoomsApi';

export default function ListingsForHotel() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const navigate = useNavigate();

  const { data: roomsData, isLoading, error } = useGetHotelRoomsQuery({ 
    limit: pagination.pageSize, 
    page: pagination.current 
  });

  const rooms = roomsData?.data?.data || [];
  const totalRooms = roomsData?.data?.meta?.total || 0;

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

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
    message.success('Room deleted successfully');
    setIsDeleteModalOpen(false);
    setSelectedHotel(null);
  };

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <img 
          src={record.hotel?.businessLogo || 'https://via.placeholder.com/80x60'} 
          alt="Hotel" 
          className="w-20 h-12 object-cover rounded-md" 
        />
      ),
    },
    {
      title: "Room Type",
      dataIndex: ["hotelRoomType"],
      key: "roomType",
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => `${record.hotelCity}, ${record.hotelCountry}`,
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => `$${record.hotelRoomPriceNight}/night`,
    },
    {
      title: "Rating",
      key: "rating",
      render: (_, record) => `⭐ ${record.hotelRating || 'N/A'}`,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          record.isBooked === 'AVAILABLE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {record.isBooked}
        </span>
      ),
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

  if (error) {
    return <div className="p-5 text-red-500">Error loading rooms: {error.message}</div>;
  }

  return (
    <div className="p-5">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Hotel Listings</h2>
        <div className="space-y-2 w-[400px] flex gap-2">
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
          />
          <Button
            type="primary"
            onClick={() => navigate("/dashboard/add-listing")}
            className="bg-blue-600 text-white !py-6 hover:bg-blue-700 p-3"
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
        <Spin spinning={isLoading}>
          <Table
            rowKey="id"
            dataSource={rooms}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: totalRooms,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} rooms`,
            }}
            onChange={handleTableChange}
            loading={isLoading}
          />
        </Spin>
      </ConfigProvider>

      {/* View Modal */}
      <Modal
        title="Room Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        ]}
      >
        {selectedHotel && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src={selectedHotel.hotel?.businessLogo || 'https://via.placeholder.com/80x60'} 
                alt={selectedHotel.hotelRoomType} 
                className="w-24 h-16 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-semibold">{selectedHotel.hotelRoomType}</h3>
                <p className="text-gray-600">{selectedHotel.hotel?.hotelName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Location</p>
                <p>{selectedHotel.hotelCity}, {selectedHotel.hotelCountry}</p>
              </div>
              <div>
                <p className="text-gray-500">Price per night</p>
                <p>${selectedHotel.hotelRoomPriceNight}</p>
              </div>
              <div>
                <p className="text-gray-500">Capacity</p>
                <p>{selectedHotel.hotelRoomCapacity}</p>
              </div>
              <div>
                <p className="text-gray-500">Rating</p>
                <p>⭐ {selectedHotel.hotelRating || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Description</p>
              <p className="text-gray-700">{selectedHotel.hotelRoomDescription || 'No description available'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Room"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this room? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}