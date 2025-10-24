import React from "react";
import { Modal, Button, Tag } from "antd";

export default function BookingDetailsModal({ open, onClose, booking }) {
  return (
    <Modal
      title="Booking Details"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {booking && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Booking ID</p>
              <p className="font-medium">{booking.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <Tag
                color={
                  booking.bookingStatus === "CONFIRMED"
                    ? "green"
                    : booking.bookingStatus === "CANCELLED"
                    ? "red"
                    : "orange"
                }
              >
                {booking.bookingStatus}
              </Tag>
            </div>
            <div>
              <p className="text-gray-600">From</p>
              <p className="font-medium">{booking.bookedFromDate}</p>
            </div>
            <div>
              <p className="text-gray-600">To</p>
              <p className="font-medium">{booking.bookedToDate}</p>
            </div>
            <div>
              <p className="text-gray-600">Rooms</p>
              <p className="font-medium">{booking.rooms}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Price</p>
              <p className="font-medium">${booking.totalPrice}</p>
            </div>
            <div>
              <p className="text-gray-600">Category</p>
              <p className="font-medium">{booking.category}</p>
            </div>
            {booking.specialRequest && (
              <div className="col-span-2">
                <p className="text-gray-600">Special Request</p>
                <p className="font-medium">{booking.specialRequest}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
