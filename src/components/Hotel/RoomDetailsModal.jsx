import React from "react";
import { Modal, Button, Descriptions, Tag, Divider, Rate } from "antd";
import { MapPin, DollarSign, Users, Star } from "lucide-react";

export default function RoomDetailsModal({ open, onClose, selectedHotel }) {
  return (
    <Modal
      title="Room Details"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {selectedHotel && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={
                selectedHotel.hotel?.businessLogo ||
                "https://via.placeholder.com/120x90"
              }
              alt={selectedHotel.hotelRoomType}
              className="w-28 h-20 object-cover rounded-md border"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-semibold m-0">
                  {selectedHotel.hotel?.hotelName || "Hotel"}
                </h3>
                <Tag color="blue" className="text-sm">
                  {selectedHotel.hotelRoomType}
                </Tag>
                <Tag
                  color={
                    selectedHotel.isBooked === "AVAILABLE" ? "green" : "red"
                  }
                  className="text-sm"
                >
                  {selectedHotel.isBooked}
                </Tag>
              </div>
              <div className="mt-1 text-gray-500 text-sm">
                Room ID: {selectedHotel.id}
              </div>
            </div>
          </div>

          <Divider className="my-2" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="font-medium">
                  {selectedHotel.hotelCity}, {selectedHotel.hotelCountry}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs text-gray-500">Price per night</div>
                <div className="font-medium">
                  ${selectedHotel.hotelRoomPriceNight}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-xs text-gray-500">Capacity</div>
                <div className="font-medium">
                  {selectedHotel.hotelRoomCapacity}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
              <Star className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs text-gray-500">Rating</div>
                <div className="flex items-center gap-2">
                  <Rate
                    disabled
                    allowHalf
                    value={Number(selectedHotel.hotelRating) || 0}
                  />
                  <span className="text-sm text-gray-600">
                    {selectedHotel.hotelRating || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Descriptions column={1} className="mt-2">
            <Descriptions.Item label="Description">
              <span className="text-gray-700">
                {selectedHotel.hotelRoomDescription ||
                  "No description available"}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
}
