import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button, message } from "antd";
import { Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../shared/Loader/Loader";
import RoomDetailsModal from "./RoomDetailsModal";
import {
  useDeleteHotelRoomMutation,
  useGetHotelRoomsQuery,
} from "../../redux/api/hotel/hotelApi";

export default function HotelRooms() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch many rooms to enable full client-side search & pagination
  const { data, isLoading } = useGetHotelRoomsQuery({ page, limit });
  const rooms = data?.data || [];

  const total = rooms?.meta?.total;

  const [deleteHotelRoom, { isLoading: isDeleting }] =
    useDeleteHotelRoomMutation();

  // Client-side search
  const filtered = rooms?.data?.filter((room) => {
    const haystack = [room?.hotelRoomType]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  const start = (page - 1) * limit;
  const paginated = filtered || [];

  const roomsData = paginated?.map((room) => ({
    ...room,
    key: room?.id,
    image: room?.hotelRoomImages?.[0],
    roomType: room?.hotelRoomType,
    location: `${room?.hotel?.hotelCity}, ${room?.hotel?.hotelCountry}`,
    price: `$${room?.hotelRoomPriceNight}/night`,
    rating: `⭐ ${room?.hotelRating || "N/A"}`,
    status: room?.isBooked,
  }));

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) => start + index + 1,
    },
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <img
          src={
            record.image ||
            record.hotel?.businessLogo ||
            "https://via.placeholder.com/80x60"
          }
          alt="Hotel"
          className="w-20 h-12 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Room Type",
      dataIndex: "roomType",
      key: "roomType",
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
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          <Eye
            className="text-[#3b82f6] w-6 h-6 cursor-pointer"
            onClick={() => {
              setSelectedHotel(record);
              setIsViewModalOpen(true);
            }}
          />
          <Trash
            className="text-red-500 w-6 h-6 cursor-pointer"
            onClick={() => {
              setSelectedHotel(record);
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-5">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Room Listings</h2>
        <div className="space-y-2 w-[400px] flex gap-2">
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          <Button
            type="primary"
            onClick={() => navigate("/dashboard/add-listing")}
            className="bg-blue-600 text-white !py-6 hover:bg-blue-700 p-3"
          >
            Add Room Listings
          </Button>
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#3b82f6",
            },
            Pagination: {
              colorPrimaryBorder: "#3b82f6",
              colorBorder: "#3b82f6",
              colorPrimaryHover: "#3b82f6",
              colorTextPlaceholder: "#3b82f6",
              itemActiveBgDisabled: "#3b82f6",
              colorPrimary: "#3b82f6",
            },
            Table: {
              headerBg: "#3b82f6",
              headerColor: "rgb(255,255,255)",
              cellFontSize: 16,
              headerSplitColor: "#3b82f6",
            },
          },
        }}
      >
        <Table
          rowKey="id"
          dataSource={roomsData}
          columns={columns}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: false,
            showQuickJumper: false,
            simple: false,
            hideOnSinglePage: false,
            showLessItems: false,
          }}
          onChange={(pager) => {
            setPage(pager.current || 1);
          }}
          loading={isLoading}
        />
      </ConfigProvider>
      <RoomDetailsModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedHotel={selectedHotel}
      />
      <Modal
        title="Delete Room"
        open={isDeleteModalOpen}
        confirmLoading={isDeleting}
        onOk={async () => {
          try {
            if (!selectedHotel?.id) return;
            await deleteHotelRoom(selectedHotel.id).unwrap();
            message.success("Room deleted successfully");
          } catch (e) {
            message.error(e?.data?.message || "Failed to delete room");
          } finally {
            setIsDeleteModalOpen(false);
            setSelectedHotel(null);
          }
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this room?</p>
      </Modal>
    </div>
  );
}
